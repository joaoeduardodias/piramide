"use server"

import { createCoupon } from "@/http/create-coupon"
import { deleteCoupon } from "@/http/delete-coupon"
import { updateCoupon } from "@/http/update-coupon"
import { updateStatusCoupon } from "@/http/update-status-coupon"
import { HTTPError } from "ky"
import { updateTag } from "next/cache"
import z from "zod/v4"

// const couponSchema = z.object({
//   id: z.uuid().optional(),
//   code: z.string().optional(),
//   value: z.number().positive().optional(),
//   minOrderValue: z.number().positive().nullable().optional(),
//   maxUses: z.number().int().positive().nullable().optional(),
//   expiresAt: z.coerce.date().nullable().optional(),
//   isActive: z.boolean().optional(),
// })
const deleteCouponSchema = z.object({
  id: z.uuid()
})

const createCouponSchema = z.object({
  code: z
    .string()
    .min(1)
    .transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  isActive: z.boolean().default(true),
  value: z.number().positive(),
  minOrderValue: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
})

export async function createCouponAction(formData: FormData) {
  try {
    const data = {
      code: formData.get("code") as string,
      type: formData.get("type") as "PERCENT" | "FIXED",
      value: Number(formData.get("value")),
      isActive: formData.get("isActive") === "true",
      minOrderValue: formData.get("minOrderValue") ? Number(formData.get("minOrderValue")) : undefined,
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : undefined,
      expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : undefined,
    }
    const result = createCouponSchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const {
      code,
      expiresAt,
      isActive,
      maxUses,
      minOrderValue,
      value,
      type
    } = result.data

    await createCoupon({
      code,
      expiresAt: String(expiresAt),
      isActive,
      maxUses,
      minOrderValue,
      value,
      type
    })

    updateTag("coupons")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao criar cupom",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function updateCouponAction(formData: FormData) {
  try {
    const couponId = formData.get("couponId") as string
    const data = {
      code: formData.get("code") as string,
      type: formData.get("type") as "PERCENT" | "FIXED",
      value: Number(formData.get("value")),
      isActive: formData.get("isActive") === "true",
      minOrderValue: formData.get("minOrderValue") ? Number(formData.get("minOrderValue")) : undefined,
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : undefined,
      expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : undefined,
    }
    const result = createCouponSchema.safeParse(data)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { success: false, message: null, errors }
    };
    const {
      code,
      expiresAt,
      isActive,
      maxUses,
      minOrderValue,
      value,
      type,
    } = result.data

    await updateCoupon({
      id: couponId,
      code,
      expiresAt,
      isActive,
      maxUses,
      minOrderValue,
      value,
      type
    })

    updateTag("coupons")

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao atualizar cupom, Tente novamente.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}

export async function deleteCouponAction(data: FormData) {
  const result = deleteCouponSchema.safeParse(data)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };
  const { id } = result.data
  try {
    await deleteCoupon({ id })
    updateTag('coupons')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao deletar cupom.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    error: null
  }
}

export async function updateStatusCouponAction(id: string) {
  try {
    await updateStatusCoupon({ id })
    updateTag('coupons')

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao atualizar status do cupom.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    error: null
  }
}


