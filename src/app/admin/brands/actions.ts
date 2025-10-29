"use server"

import { createBrand } from "@/http/create-brand"
import { deleteBrand } from "@/http/delete-brand"
import { updateBrand } from "@/http/update-brand"
import { HTTPError } from "ky"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
    console.log(err);
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
  redirect("/admin/brands")
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

    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")


  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    console.log(err);
    return {
      success: false,
      message: "Erro ao atualizar marca, Tente novamente.",
      errors: null
    }
  }
  redirect("/admin/brands")
}

export async function deleteBrandAction(id: string) {
  try {
    await deleteBrand({ id })
    revalidatePath("/admin/brands")
    revalidatePath("/admin/products")


    return {
      success: true,
      message: "Marca deletada com sucesso",
      error: null
    }
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
}


