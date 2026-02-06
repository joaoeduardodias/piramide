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
const updateProductSchema = createProductSchema.extend({
  options: z.array(z.object({
    name: z.string(),
    values: z.array(z.object({
      id: z.string(),
      value: z.string().optional(),
      content: z.string().optional(),
    })),
  })).optional(),
  variants: z.array(z.object({
    id: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().optional(),
    comparePrice: z.number().optional(),
    stock: z.number().int().default(0),
    optionValueIds: z.array(z.string()).optional(),
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
  const optionsData = data.get("options") as string | null
  const variantsData = data.get("variants") as string
  const categoriesData = data.get("categories") as string
  let formattedVariants: any[] = []
  let categoriesIds: string[] = []
  try {
    formattedVariants = variantsData ? JSON.parse(variantsData) : []
    if (!Array.isArray(formattedVariants)) formattedVariants = []
    formattedVariants = formattedVariants.map((variant) => ({
      ...variant,
      price: variant.price !== undefined && variant.price !== null ? Number(variant.price) : undefined,
      comparePrice: variant.comparePrice !== undefined && variant.comparePrice !== null ? Number(variant.comparePrice) : undefined,
      stock: variant.stock !== undefined && variant.stock !== null ? Number(variant.stock) : undefined,
      optionValueIds: Array.isArray(variant.optionValueIds) ? variant.optionValueIds : undefined,
    }))
  } catch {
    return { success: false, message: "Variantes inválidas.", errors: { variants: ["Variantes inválidas."] } }
  }
  try {
    categoriesIds = categoriesData ? JSON.parse(categoriesData) : []
    if (!Array.isArray(categoriesIds)) categoriesIds = []
  } catch {
    return { success: false, message: "Categorias inválidas.", errors: { categories: ["Categorias inválidas."] } }
  }
  let formattedOptions:
    | { name: string; values: Array<{ id?: string; value?: string; content?: string | null }> }[]
    | undefined



  if (optionsData) {
    try {
      const parsed = JSON.parse(optionsData)
      if (Array.isArray(parsed)) {
        formattedOptions = parsed.map((opt) => ({
          name: String(opt.name),
          values: Array.isArray(opt.values)
            ? opt.values.map((v: any) => ({
              id: v.id,
              value: v.value ?? undefined,
              content: v.content ?? undefined,
            }))
            : Array.isArray(opt.valueIds)
              ? opt.valueIds.map((id: string) => ({ id }))
              : [],
        }))
      } else {
        const record = parsed as Record<string, Array<{ id?: string; value?: string; content?: string | null }>>
        formattedOptions = Object.entries(record).map(([name, values]) => ({
          name,
          values: values.map(v => ({
            ...v,
            content: v.content ?? undefined,
          })),
        }))
      }
    } catch {
      formattedOptions = undefined
    }
  }
  if (formattedOptions && formattedOptions.length === 0) {
    formattedOptions = undefined
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
  const result = updateProductSchema.safeParse(formattedData)
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
    variants,
    tags,
  } = result.data

  try {
    const shouldSendOptions = !!(formattedOptions && formattedOptions.length > 0)

    if (shouldSendOptions) {
      const missingOptionValueIds = (variants ?? []).some((variant) => !variant.optionValueIds || variant.optionValueIds.length === 0)
      if (missingOptionValueIds) {
        return {
          success: false,
          message: "Selecione valores de variação para todas as variantes.",
          errors: { variants: ["Selecione valores de variação para todas as variantes."] }
        }
      }
    }

    const payloadVariants = shouldSendOptions
      ? (variants ?? []).map((variant) => ({
        sku: variant.sku,
        price: variant.price,
        comparePrice: variant.comparePrice,
        stock: variant.stock,
        optionValueIds: variant.optionValueIds,
      }))
      : (variants ?? []).map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
      }))

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
      options: formattedOptions,
      variants: payloadVariants,
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
    message: null,
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
