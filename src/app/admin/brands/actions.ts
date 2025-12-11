"use server"

import { createBrand } from "@/http/create-brand"
import { deleteBrand } from "@/http/delete-brand"
import { updateBrand } from "@/http/update-brand"
import { HTTPError } from "ky"
import { revalidatePath, updateTag } from "next/cache"
import z from "zod/v4"

const brandSchema = z.object({
  id: z.uuid(),
  name: z.string("O nome é obrigatório"),
  slug: z.string("SLUG é obrigatório")
})

const createBrandSchema = z.object({
  name: z.string("O nome é obrigatório"),
  slug: z.string("SLUG é obrigatório")
})

export async function createBrandAction(data: FormData) {
  try {
    const result = createBrandSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const { name, slug } = result.data

    await createBrand({ name, slug })

    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao adicionar marca.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function updateBrandAction(data: FormData) {
  try {
    const result = brandSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const { id, name, slug } = result.data

    await updateBrand({ id, name, slug })

    updateTag("brands")
    updateTag(`brand-${id}`)

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao atualizar marca, Tente novamente.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function deleteBrandAction(id: string) {
  try {
    await deleteBrand({ id })
    updateTag('brands')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao deletar marca.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    error: null
  }
}


