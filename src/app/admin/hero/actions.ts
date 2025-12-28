"use server"

import { createHeroBanner } from "@/http/create-hero-banner";
import { deleteHeroBanner } from "@/http/delete-hero-banner";
import { updateHeroBanner } from "@/http/update-hero-banner";
import { HTTPError } from "ky";
import { updateTag } from "next/cache";
import { z } from "zod";

const heroBannerSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().min(1, "Subtítulo é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  image: z.url().min(1, "Imagem é obrigatória"),
  cta: z.string().min(1, "Texto do botão é obrigatório"),
  link: z.string().min(1, "Link é obrigatório"),
  order: z.number().int().min(0, "Ordem deve ser maior ou igual a 0").transform((val) => Number(val)),
  isActive: z.boolean().optional().default(true),
})

export async function createHeroBannerAction(data: FormData) {
  const rawData = Object.fromEntries(data.entries());
  try {
    const formattedData = {
      ...rawData,
      order: Number(data.get("order")),
      isActive: data.get("isActive") === "true" ? true : false,
    }

    const result = heroBannerSchema.safeParse(formattedData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);
      return { success: false, message: null, errors }
    };
    const {
      cta,
      description,
      image,
      isActive,
      link,
      order,
      subtitle,
      title

    } = result.data

    await createHeroBanner({
      cta,
      description,
      image,
      isActive,
      link,
      order,
      subtitle,
      title
    })

    updateTag("hero-banners")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao adicionar banner.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}
export async function updateHeroBannerAction(data: FormData) {
  try {
    const bannerId = data.get("bannerId") as string
    const rawData = Object.fromEntries(data)
    const formattedData = {
      ...rawData,
      order: Number(data.get("order")),
      isActive: data.get("isActive") === "true" ? true : false,
    }
    const result = heroBannerSchema.safeParse(formattedData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);
      return { success: false, message: null, errors }
    }

    const {
      cta,
      description,
      image,
      isActive,
      link,
      order,
      subtitle,
      title

    } = result.data

    await updateHeroBanner({
      id: bannerId,
      cta,
      description,
      image,
      isActive,
      link,
      order,
      subtitle,
      title
    })

    updateTag("hero-banners")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao atualizar banner.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await deleteHeroBanner({ id })
    updateTag("hero-banners")


  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao deletar Hero Banner.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    error: null
  }
}

export async function toggleBannerStatus(bannerId: string, isActive: boolean) {
  try {
    await updateHeroBanner({
      id: bannerId,
      isActive
    })
    updateTag("hero-banners")



  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao alterar status do banner.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    error: null
  }
}
