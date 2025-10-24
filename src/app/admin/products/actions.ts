"use server"

import { createOption } from "@/http/create-option"
import { createProduct } from "@/http/create-product"
import { deleteProduct } from "@/http/delete-product"
import { getProductById } from "@/http/get-product-by-id"
import { updateProduct } from "@/http/update-product"
import { r2 } from "@/lib/cloudfare"
import { generateSlug } from "@/utils/generate-slug"
import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { HTTPError } from "ky"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "node:crypto"
import z from "zod/v4"

const ProductStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])


const createProductSchema = z.object({
  name: z.string().min(1, 'Digite o nome do produto'),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  price: z.number('Preço é obrigatório.').positive('Preço deve ser positivo'),
  comparePrice: z.number('Preço é obrigatório.').positive('Preço deve ser positivo'),
  status: ProductStatusEnum.default('DRAFT'),
  weight: z.number().positive("Peso deve ser positivo.").optional(),
  category: z.array(z.uuid('Selecione uma categoria')),
  images: z.array(z.instanceof(File))
    .nonempty("Envie pelo menos uma imagem")
    .refine(
      (files) => files.every((f) => f.size < 5 * 1024 * 1024),
      "Cada imagem deve ter menos de 5MB"
    ),
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

// const updateProductSchema = z.object({
//   name: z.string().min(1, 'Digite o nome do produto'),
//   description: z.string().optional(),
//   featured: z.boolean().default(false),
//   price: z.number('Preço é obrigatório.').positive('Preço deve ser positivo'),
//   comparePrice: z.number('Preço é obrigatório.').positive('Preço deve ser positivo'),
//   status: ProductStatusEnum.default('DRAFT'),
//   weight: z.number().positive("Peso deve ser positivo.").optional(),
//   category: z.array(z.uuid('Selecione uma categoria')),
//   images: z.array(z.instanceof(File))
//     .nonempty("Envie pelo menos uma imagem")
//     .refine(
//       (files) => files.every((f) => f.size < 5 * 1024 * 1024),
//       "Cada imagem deve ter menos de 5MB"
//     ),
//   tags: z.string().optional(),
//   options: z.array(z.object({
//     name: z.string(),
//     values: z.array(z.object({
//       content: z.string().optional(),
//       value: z.string()
//     })),
//   })),
//   variants: z.array(z.object({
//     sku: z.string().optional(),
//     price: z.number().optional(),
//     comparePrice: z.number().optional(),
//     stock: z.number().int().default(0),
//     optionValueIds: z.array(z.string().uuid()).optional(),
//   })).optional(),
// })

const createOptionSchema = z.object({
  name: z.string("Nome é obrigatório."),
  values: z.array(z.object({
    content: z.string().nullable(),
    value: z.string("Valor é obrigatório"),
  })),
})

export async function createProductAction(data: FormData) {

  const optionsData = data.get("options") as string


  const formattedOptions = Object.entries(JSON.parse(optionsData)).map(([name, values]) => ({
    name,
    values
  }))

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
    images: data.getAll("images").filter((f): f is File => f instanceof File),
    options: formattedOptions,
    variants: formattedVariants
  };

  console.log(formattedData);

  const result = createProductSchema.safeParse(formattedData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors);
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
    images,
    weight,
    options,
    variants,
    tags,
  } = result.data


  try {

    const uploads = await Promise.all(
      images.map(async (image, index) => {
        const sanitizedName = image.name.replace(/\s+/g, "-")
        const fileKey = `${randomUUID()}-${sanitizedName}`
        const contentType = image.type

        const signedUrl = await getSignedUrl(
          r2,
          new PutObjectCommand({
            Bucket: "piramide",
            Key: fileKey,
            ContentType: contentType,
            ACL: "public-read",
          }),
          { expiresIn: 600 }
        )
        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": contentType,
          },
          body: buffer,
        })

        if (!uploadRes.ok) throw new Error(`Falha ao enviar ${image.name}`)
        const publicUrl = `${process.env.CLOUDFARE_PUBLIC_URL}/${fileKey}`
        return {
          url: publicUrl,
          alt: image.name.split(".")[0],
          sortOrder: index,
          fileKey,
        }
      })
    )
    await createProduct({
      categoryIds: category,
      comparePrice,
      description,
      featured,
      images: uploads,
      name,
      price,
      slug: generateSlug(name),
      status,
      weight,
      tags,
      options,
      variants
    })
    revalidatePath("/admin/products")
    revalidatePath("/products")

    // return {
    //   success: true,
    //   message: 'Produto Criado',
    //   errors: null
    // }

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
  redirect("/admin/products")
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

    revalidatePath("/admin/products")
    revalidatePath("/products")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }
  redirect("/admin/products")
}

export async function updateProductAction(data: FormData) {
  const productId = data.get("id") as string
  if (!productId) {
    return { success: false, message: "ID do produto ausente", errors: null }
  }

  const optionsData = data.get("options") as string
  const formattedOptions = JSON.parse(optionsData)

  const variantsData = data.get("variations") as string
  const formattedVariants = JSON.parse(variantsData)

  const rawData = Object.fromEntries(data.entries())
  const formattedData = {
    ...rawData,
    price: Number(rawData.price),
    comparePrice: rawData.comparePrice ? Number(rawData.comparePrice) : undefined,
    weight: rawData.weight ? Number(rawData.weight) : undefined,
    featured: rawData.featured === "true",
    category: Array.isArray(rawData.category)
      ? rawData.category
      : [rawData.category].filter(Boolean),
    images: data.getAll("images"),
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
    status,
    category,
    comparePrice,
    description,
    images,
    weight,
    // options,
    variants,
    tags,
  } = result.data

  try {

    const { product } = await getProductById({ id: productId })

    const existingImages = product.images
    const existingUrls = existingImages.map((i) => i.url)

    const finalImages: any[] = []
    const uploadedUrls: string[] = []

    for (let i = 0; i < images.length; i++) {
      const item = images[i]

      if (item instanceof File) {
        const sanitizedName = item.name.replace(/\s+/g, "-")
        const fileKey = `${randomUUID()}-${sanitizedName}`
        const contentType = item.type

        const signedUrl = await getSignedUrl(
          r2,
          new PutObjectCommand({
            Bucket: "piramide",
            Key: fileKey,
            ContentType: contentType,
            ACL: "public-read",
          }),
          { expiresIn: 600 }
        )

        const arrayBuffer = await item.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: buffer,
        })

        if (!uploadRes.ok) throw new Error(`Falha ao enviar ${item.name}`)

        const publicUrl = `${process.env.CLOUDFARE_PUBLIC_URL}/${fileKey}`
        uploadedUrls.push(publicUrl)

        finalImages.push({
          url: publicUrl,
          alt: item.name.split(".")[0],
          sortOrder: i,
          fileKey,
        })
      } else if (typeof item === "string" && String(item).startsWith("http")) {
        // Já existe no bucket → mantém
        finalImages.push({
          url: item,
          alt: String(item).split("/").pop()?.split(".")[0] ?? "",
          sortOrder: i,
        })
        uploadedUrls.push(item)
      }
    }

    // 🗑️ 3. Deletar imagens que não estão mais no form
    const removed = existingUrls.filter((url) => !uploadedUrls.includes(url))
    if (removed.length > 0) {
      await Promise.all(
        removed.map(async (url) => {
          const key = url.split("/").pop()!
          await r2.send(
            new DeleteObjectCommand({
              Bucket: "piramide",
              Key: key,
            })
          )
        })
      )
    }


    await updateProduct({
      id: productId,
      categoryIds: category,
      comparePrice,
      description,
      featured,
      images: finalImages,
      name,
      price,
      slug: generateSlug(name),
      status,
      weight,
      tags,
      // options,
      variants,
    })

    revalidatePath("/admin/products")
    revalidatePath("/products")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }
  redirect('/admin/products')
}


export async function createOptionAction(data: FormData) {
  const nameItem = data.get("name") as string
  const valuesRaw = data.get("values") as string | null
  const valuesItem = valuesRaw ? JSON.parse(valuesRaw) : []
  const payload = { name: nameItem, values: valuesItem }
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

    revalidatePath("/admin/products/new")
    revalidatePath("/admin/products/update/:id")

    return {
      success: true,
      message: 'Opção Criada',
      errors: null
    }

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }

}
