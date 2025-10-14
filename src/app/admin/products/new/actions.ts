"use server"

import { createProduct } from "@/http/create-product"
import { r2 } from "@/lib/cloudfare"
import { generateSlug } from "@/utils/generate-slug"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { HTTPError } from "ky"
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
    values: z.array(z.string().min(1)),
  })).optional(),
  variants: z.array(z.object({
    sku: z.string().optional(),
    price: z.number().optional(),
    comparePrice: z.number().optional(),
    stock: z.number().int().default(0),
    optionValueIds: z.array(z.string().uuid()).optional(),
  })).optional(),
})


export async function createProductAction(data: FormData) {
  const optionsData = data.get("options") as string
  const formattedOptions = JSON.parse(optionsData)
  const variantsData = data.get("variations") as string
  const formattedVariants = JSON.parse(variantsData)
  const rawData = Object.fromEntries(data.entries());
  const formattedData = {
    ...rawData,
    price: Number(rawData.price),
    comparePrice: rawData.comparePrice ? Number(rawData.comparePrice) : undefined,
    weight: rawData.weight ? Number(rawData.weight) : undefined,
    featured: rawData.featured === "true",
    category: Array.isArray(rawData.category)
      ? rawData.category
      : [rawData.category].filter(Boolean),
    images: data.getAll("images").filter((f): f is File => f instanceof File),
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

    // Revalidate products page
    // revalidatePath("/admin/products")
    // revalidatePath("/products")

    return {
      success: true,
      message: 'Produto Criado',
      errors: null
    }

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    console.log(err);
    return {
      success: false,
      message: "Erro ao criar produto. Tente novamente.",
      errors: null
    }
  }
}


