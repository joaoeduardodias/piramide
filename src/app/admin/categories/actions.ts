"use server"

import { createCategory } from "@/http/create-category"
import { deleteCategory } from "@/http/delete-category"
import { updateCategory } from "@/http/update-category"
import { HTTPError } from "ky"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
  try {
    const result = createCategorySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const { name, slug } = result.data

    await createCategory({ name, slug })

    revalidatePath("/admin/categories")

  } catch (err: any) {
    console.log(err);
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
  redirect("/admin/categories")
}

export async function updateCategoryAction(data: FormData) {
  try {
    const result = categorySchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const { id, name, slug } = result.data

    await updateCategory({ id, name, slug })

    revalidatePath("/admin/categories")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    console.log(err);
    return {
      success: false,
      message: "Erro ao atualizar categoria, Tente novamente.",
      errors: null
    }
  }
  redirect("/admin/categories")
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory({ id })
    revalidatePath("/admin/categories")

    return {
      success: true,
      message: "Categoria deletada com sucesso",
      error: null
    }
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
}


