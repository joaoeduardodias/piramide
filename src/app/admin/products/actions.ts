"use server"

import { createOption } from "@/http/create-option"
import { createOptionValue } from "@/http/create-option-value"
import { createProduct } from "@/http/create-product"
import { deleteProduct } from "@/http/delete-product"
import { getProductById } from "@/http/get-product-by-id"
import { updateImages } from "@/http/update-images"
import { updateProduct } from "@/http/update-product"
import { r2 } from "@/lib/cloudfare"
import { generateSlug } from "@/utils/generate-slug"
import { DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { HTTPError } from "ky"
import { updateTag } from "next/cache"
import z from "zod/v4"

const ProductStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

const createProductSchema = z.object({
  name: z.string().min(1, 'Digite o nome do produto'),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  price: z.number('Preço é obrigatório.').positive('Preço deve ser positivo'),
  comparePrice: z.number().nullish(),
  status: ProductStatusEnum.default('DRAFT'),
  weight: z.number().positive("Peso deve ser positivo.").optional(),
  category: z.array(z.uuid('Selecione uma categoria')),
  brandId: z.uuid("Selecione uma marca"),
  uploads: z.array(z.object({
    fileKey: z.string(),
    presignedUrl: z.string().optional(),
    url: z.url(),
  })).optional(),
  tags: z.string().optional(),
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.object({
      id: z.uuid(),
      value: z.string(),
      content: z.string().optional(),
    })),
  })),
  variants: z.array(z.object({
    sku: z.string().optional(),
    price: z.number().optional(),
    comparePrice: z.number().optional(),
    stock: z.number().int().default(0),
    optionValueIds: z.array(z.uuid()).optional(),
  })).optional(),
})
const deleteProductSchema = z.object({
  id: z.uuid()
})
const createOptionSchema = z.object({
  name: z.string("Nome é obrigatório."),
  values: z.array(z.object({
    content: z.string().nullable(),
    value: z.string("Valor é obrigatório"),
  })),
})
const createOptionValueSchema = z.object({
  optionName: z.string("OptionName é obrigatório."),
  values: z.array(z.object({
    content: z.string().nullable(),
    value: z.string("Valor é obrigatório"),
  })),
})

export async function createProductAction(data: FormData) {

  const optionsData = data.get("options") as string
  let formattedOptions: { name: string; values: Array<{ id?: string; value: string; content?: string | null }> }[] = []
  if (optionsData) {
    try {
      const parsed = JSON.parse(optionsData) as Record<string, Array<{ id?: string; value: string; content?: string | null }>>;
      formattedOptions = Object.entries(parsed).map(([name, values]) => ({
        name,
        values: values.map(v => ({
          ...v,
          content: v.content ?? undefined,
        })),
      }))
    } catch {
      console.warn("Erro options, ignorando valor inválido.")
      formattedOptions = []
    }
  }

  const filesUpload = data.get("filesUpload") as string | null
  let formattedFilesUploads: any[] = []
  if (filesUpload) {
    try {
      const parsed = JSON.parse(filesUpload)
      formattedFilesUploads = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      console.warn("Erro filesUpload, ignorando valor inválido.")
      formattedFilesUploads = []
    }
  }

  const variantsData = data.get("variants") as string

  const formattedVariants = JSON.parse(variantsData)
  const categoriesData = data.get("categories") as string
  const categoriesIds = JSON.parse(categoriesData)

  const rawData = Object.fromEntries(data.entries());
  const formattedData = {
    ...rawData,
    price: Number(rawData.price),
    comparePrice: rawData.comparePrice ? Number(rawData.comparePrice) : undefined,
    weight: rawData.weight ? Number(rawData.weight) : undefined,
    featured: rawData.featured === "true",
    category: categoriesIds,
    uploads: formattedFilesUploads,
    options: formattedOptions,
    variants: formattedVariants
  };


  const result = createProductSchema.safeParse(formattedData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };
  const {
    featured,
    name,
    price,
    status,
    category,
    comparePrice,
    description,
    weight,
    brandId,
    options,
    variants,
    uploads,
    tags,
  } = result.data


  try {
    await createProduct({
      categoryIds: category,
      comparePrice: comparePrice && comparePrice * 100,
      description,
      featured,
      name,
      price: price * 100,
      slug: generateSlug(name),
      status,
      weight,
      tags,
      brandId,
      options,
      variants,
      images: uploads!.map((u, i) => ({
        fileKey: u.fileKey,
        url: u.url,
        sortOrder: i + 1,
      })),
    })
    updateTag('products')

  } catch (err: any) {

    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao criar produto. Tente novamente.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function deleteProductAction(data: FormData) {

  const result = deleteProductSchema.safeParse(Object.fromEntries(data));
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };

  const { id } = result.data
  try {
    const { product } = await getProductById({ id })

    await deleteProduct({ id })

    const fileKeys = product.images.map(img => String(img.fileKey))

    if (fileKeys.length > 0) {
      const command = new DeleteObjectsCommand({
        Bucket: String(process.env.CLOUDFARE_BUCKET_NAME),
        Delete: {
          Objects: fileKeys.map(key => ({ Key: key })),
          Quiet: true,
        },
      })

      await r2.send(command)
    }
    updateTag('products')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Erro encontrado ao deletar produto.',
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function updateProductAction(data: FormData) {
  const productId = data.get("id") as string
  const optionsData = data.get("options") as string
  const variantsData = data.get("variants") as string
  const formattedVariants = JSON.parse(variantsData)
  const categoriesData = data.get("categories") as string
  const categoriesIds = JSON.parse(categoriesData)
  let formattedOptions: { name: string; values: Array<{ id?: string; value: string; content?: string | null }> }[] = []
  if (optionsData) {
    try {
      const parsed = JSON.parse(optionsData) as Record<string, Array<{ id?: string; value: string; content?: string | null }>>;
      formattedOptions = Object.entries(parsed).map(([name, values]) => ({
        name,
        values: values.map(v => ({
          ...v,
          content: v.content ?? undefined,
        })),
      }))
    } catch {
      formattedOptions = []
    }
  }
  const rawData = Object.fromEntries(data.entries())
  const filesUpload = data.get("filesUpload") as string | null
  let formattedFilesUploads: any[] = []

  if (filesUpload) {
    try {
      const parsed = JSON.parse(filesUpload)
      formattedFilesUploads = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      console.warn("Erro filesUpload, ignorando valor inválido.")
      formattedFilesUploads = []
    }
  }
  const formattedData = {
    ...rawData,
    price: rawData.price ? Number(rawData.price) : undefined,
    comparePrice: rawData.comparePrice ? Number(rawData.comparePrice) : undefined,
    weight: rawData.weight ? Number(rawData.weight) : undefined,
    featured: rawData.featured === "true",
    category: categoriesIds,
    options: formattedOptions,
    variants: formattedVariants,

  }

  const result = createProductSchema.safeParse(formattedData)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const {
    featured,
    name,
    price,
    category,
    comparePrice,
    description,
    weight,
    brandId,
    options,
    variants,
    tags,
  } = result.data

  try {
    await updateProduct({
      id: productId,
      name,
      slug: generateSlug(name),
      price: price * 100,
      comparePrice: comparePrice && comparePrice * 100,
      weight,
      featured,
      description,
      brandId,
      tags,
      categoryIds: category,
      options,
      variants,
    })
    const uploads = formattedFilesUploads


    if (uploads && uploads.length > 0) {

      await updateImages({
        productId,
        images: uploads.map((u, i) => ({
          fileKey: u.fileKey,
          url: u.url,
          sortOrder: i + 1,
        }))
      })
    }
    updateTag('products')
    updateTag(`product-${productId}`)

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }
    return { success: false, message: "Erro inesperado. Tente novamente.", errors: null }
  }
  return {
    success: true,
    message: false,
    errors: null
  }
}

export async function createOptionAction(data: FormData) {
  const nameItem = data.get("name") as string
  const valuesRaw = data.get("values") as string | null
  const valuesItem = valuesRaw ? JSON.parse(valuesRaw) : []
  const payload = { name: nameItem.toLowerCase(), values: valuesItem }
  const result = createOptionSchema.safeParse(payload)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, values } = result.data

  try {
    await createOption({
      name,
      values
    })
    updateTag("options")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Erro encontrado ao criar Opção.',
      errors: null
    }
  }

  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function createOptionValueAction(data: FormData) {
  const optionNameData = data.get("optionName") as string

  const valuesRaw = data.get("valuesData") as string | null
  const valuesItem = valuesRaw ? JSON.parse(valuesRaw) : []
  const payload = { optionName: optionNameData, values: valuesItem }
  const result = createOptionValueSchema.safeParse(payload)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { optionName, values } = result.data

  try {
    await createOptionValue({
      optionName,
      values
    })
    updateTag("options")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro encontrado ao criar Valor da Opção",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }

}
