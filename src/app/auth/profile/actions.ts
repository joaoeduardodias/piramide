"use server"

import { UpdateUser } from "@/http/update-user";
import type { Address } from "@/lib/types";
import { HTTPError } from "ky";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod/v4";

const updateUserSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  cpf: z.string().transform((s) => s.replace(/\D/g, "")).refine((s) => s.length === 11, { message: "CPF inválido" }),
  phone: z.string().transform((s) => s.replace(/\D/g, "")).refine((s) => s.length >= 10 && s.length <= 11, {
    message: "Telefone inválido",
  }),
});

export async function updateUserAction(data: FormData) {
  const result = updateUserSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors);
    return { success: false, message: null, errors }
  };

  const { cpf, name, phone } = result.data
  try {
    await UpdateUser({ cpf, name, phone });
    revalidateTag('profile')
  }
  catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Erro encontrado. Tente novamente mais tarde.',
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}


export async function addAddress(formData: FormData) {
  const name = formData.get("name") as string
  const street = formData.get("street") as string
  const number = formData.get("number") as string
  const complement = formData.get("complement") as string
  const neighborhood = formData.get("neighborhood") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string
  const isDefault = formData.get("isDefault") === "true"

  const newAddress: Address = {
    id: Date.now().toString(),
    name,
    street,
    number,
    complement: complement || undefined,
    neighborhood,
    city,
    state,
    zipCode: zipCode.replace(/\D/g, ""),
    isDefault,
  }

  // If new address is default, remove default from others
  if (isDefault) {
    mockAddresses = mockAddresses.map((addr) => ({ ...addr, isDefault: false }))
  }

  // If it's the first address, make it default
  if (mockAddresses.length === 0) {
    newAddress.isDefault = true
  }

  mockAddresses.push(newAddress)

  revalidatePath("/auth/profile")
  return { success: true, address: newAddress }
}

export async function updateAddress(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const street = formData.get("street") as string
  const number = formData.get("number") as string
  const complement = formData.get("complement") as string
  const neighborhood = formData.get("neighborhood") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zipCode = formData.get("zipCode") as string

  const index = mockAddresses.findIndex((addr) => addr.id === id)
  if (index === -1) {
    return { success: false, error: "Endereço não encontrado" }
  }

  mockAddresses[index] = {
    ...mockAddresses[index],
    name,
    street,
    number,
    complement: complement || undefined,
    neighborhood,
    city,
    state,
    zipCode: zipCode.replace(/\D/g, ""),
  }

  revalidatePath("/auth/profile")
  return { success: true }
}

export async function deleteAddress(id: string) {
  const index = mockAddresses.findIndex((addr) => addr.id === id)
  if (index === -1) {
    return { success: false, error: "Endereço não encontrado" }
  }

  const wasDefault = mockAddresses[index].isDefault
  mockAddresses = mockAddresses.filter((addr) => addr.id !== id)

  // If deleted address was default, set first remaining as default
  if (wasDefault && mockAddresses.length > 0) {
    mockAddresses[0].isDefault = true
  }

  revalidatePath("/auth/profile")
  return { success: true }
}

export async function setDefaultAddress(id: string) {
  mockAddresses = mockAddresses.map((addr) => ({
    ...addr,
    isDefault: addr.id === id,
  }))

  revalidatePath("/auth/profile")
  return { success: true }
}
