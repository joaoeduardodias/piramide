"use server"

import { createAddress } from "@/http/create-address";
import { deleteAddress } from "@/http/delete-address";
import { setAddressDefault } from "@/http/set-address-default";
import { updateAddress } from "@/http/update-address";
import { UpdateUser } from "@/http/update-user";
import { HTTPError } from "ky";
import { revalidateTag } from "next/cache";
import { z } from "zod/v4";

const updateUserSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  cpf: z.string().transform((s) => s.replace(/\D/g, "")).refine((s) => s.length === 11, { message: "CPF inválido" }),
  phone: z.string().transform((s) => s.replace(/\D/g, "")).refine((s) => s.length >= 10 && s.length <= 11, {
    message: "Telefone inválido",
  }),
});
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  name: z.string('Name is required'),
  complement: z.string().optional(),
  number: z.string().nullish(),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required').transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length === 8, {
      message: "Postal code invalid",
    }),
  isDefault: z.boolean().default(false),
})

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
    revalidateTag('profile', 'max')
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


export async function createAddressAction(data: FormData) {
  const isDefaultRaw = data.get("isDefault")
  const isDefault = isDefaultRaw === "true"
  const rawData = Object.fromEntries(data.entries());
  const formatData = {
    ...rawData,
    isDefault
  }
  const result = addressSchema.safeParse(formatData);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors);
    return { success: false, message: null, errors }
  };

  const {
    city,
    name,
    postalCode,
    state,
    street,
    number,
    complement,
    district,

  } = result.data
  try {
    await createAddress({
      city,
      isDefault,
      name,
      postalCode,
      state,
      street,
      number,
      complement,
      district,
    })
    revalidateTag("addresses", 'max')
  } catch (err: any) {
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

export async function updateAddressAction(data: FormData) {
  const result = addressSchema.safeParse(Object.fromEntries(data));
  const id = data.get("id") as string;
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors);
    return { success: false, message: null, errors }
  };
  const {
    city,
    isDefault,
    name,
    postalCode,
    state,
    street,
    number,
    complement,
    district,
  } = result.data
  try {
    await updateAddress({
      city,
      isDefault,
      name,
      postalCode,
      state,
      street,
      number,
      complement,
      district,
      id,
    })
    revalidateTag("addresses", 'max')

  } catch (err: any) {
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

export async function deleteAddressAction(id: string) {
  try {
    await deleteAddress({ id })
    revalidateTag("addresses", 'max')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message };
    }
    return {
      success: false,
      message: 'Erro encontrado. Tente novamente mais tarde.',
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}

export async function setDefaultAddressAction(id: string) {
  try {
    await setAddressDefault({ id })
    revalidateTag("addresses", 'max')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message };
    }
    return {
      success: false,
      message: 'Erro encontrado. Tente novamente mais tarde.',
    }
  }
  return {
    success: true,
    message: null,
    errors: null
  }
}
