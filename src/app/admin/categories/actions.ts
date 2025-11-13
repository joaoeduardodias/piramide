"use server"

import { createCategory } from "@/http/create-category"
import { deleteCategory } from "@/http/delete-category"
import { updateCategory } from "@/http/update-category"
import { HTTPError } from "ky"
import { revalidateTag } from "next/cache"
import z from "zod/v4"

const categorySchema = z.object({
  id: z.uuid(),
  name: z.string("O nome é obrigatório"),
  slug: z.string("SLUG é obrigatório")
})

const createCategorySchema = z.object({
  name: z.string("O nome é obrigatório"),
  slug: z.string("SLUG é obrigatório")
})

export async function createCategoryAction(data: FormData) {
  const result = createCategorySchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };

  const { name, slug } = result.data

  try {
    await createCategory({ name, slug })
    revalidateTag('categories')
  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao criar categoria.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function updateCategoryAction(data: FormData) {
  const result = categorySchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };
  const { id, name, slug } = result.data


  try {
    await updateCategory({ id, name, slug })
    revalidateTag(`categories`)
    revalidateTag(`category-${id}`)

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao atualizar categoria, Tente novamente.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory({ id })
    revalidateTag("categories")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao deletar categoria.",
      errors: null
    }
  }

  return {
    success: true,
    message: null,
    error: null
  }
}


