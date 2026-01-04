"use server"

import { createCoupon } from "@/http/create-coupon"
import { deleteCoupon } from "@/http/delete-coupon"
import { updateCoupon } from "@/http/update-coupon"
import { updateStatusCoupon } from "@/http/update-status-coupon"
import { HTTPError } from "ky"
import { updateTag } from "next/cache"
import z from "zod/v4"


const deleteCouponSchema = z.object({
  id: z.uuid()
})

const createCouponSchema = z.object({
  code: z
    .string()
    .min(1)
    .transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  scope: z.enum(['ALL_PRODUCTS', 'PRODUCTS']),
  isActive: z.boolean().default(true),
  value: z.number().positive(),
  minOrderValue: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  productIds: z.array(z.uuid()).optional(),
}).refine(data => {
  if (data.scope === 'PRODUCTS') {
    return data.productIds && data.productIds.length > 0
  }
  return true
}, {
  message: 'Selecione ao menos um produto para este cupom',
  path: ['productIds'],
})

export async function createCouponAction(formData: FormData) {
  try {
    const type = formData.get("type") as "PERCENT" | "FIXED"
    const scope = formData.get("scope") as "PRODUCTS" | "All_PRODUCTS"

    const rawValue = Number(formData.get("value"))
    const rawMinOrderValue = formData.get("minOrderValue")

    const productIds = formData.getAll("productIds") as string[]

    const data = {
      code: formData.get("code") as string,
      type,
      scope,
      isActive: formData.get("isActive") === "true",

      value: type === "FIXED"
        ? Math.round(rawValue * 100)
        : rawValue,

      minOrderValue: rawMinOrderValue
        ? Math.round(Number(rawMinOrderValue) * 100)
        : undefined,

      maxUses: formData.get("maxUses")
        ? Number(formData.get("maxUses"))
        : undefined,

      expiresAt: formData.get("expiresAt")
        ? new Date(formData.get("expiresAt") as string)
        : undefined,

      productIds: scope === "PRODUCTS" ? productIds : undefined,
    }

    const result = createCouponSchema.safeParse(data)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);
      return { success: false, message: null, errors }
    };

    const {
      code,
      expiresAt,
      isActive,
      maxUses,
      minOrderValue,
      value,
      type: parsedType,
      scope: parsedScope,
      productIds: parsedProductIds,
    } = result.data

    await createCoupon({
      code,
      type: parsedType,
      scope: parsedScope,
      value,
      isActive,
      maxUses,
      minOrderValue,
      expiresAt: expiresAt ? expiresAt.toISOString() : undefined,
      productIds: parsedProductIds,
    })

    updateTag("coupons")

    return { success: true, message: null, errors: null }

  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: "Erro ao criar cupom",
      errors: null,
    }
  }
}

export async function updateCouponAction(formData: FormData) {
  try {
    const couponId = formData.get("couponId") as string
    const type = formData.get("type") as "PERCENT" | "FIXED"
    const rawValue = Number(formData.get("value"))
    const rawMinOrderValue = formData.get("minOrderValue")
    const productIds = formData.getAll("productIds") as string[]
    const scope = formData.get("scope") as "PRODUCTS" | "ALL_PRODUCTS"
    const data = {
      code: formData.get("code") as string,
      type,
      scope,
      isActive: formData.get("isActive") === "true",

      value: type === "FIXED"
        ? Math.round(rawValue * 100)
        : rawValue,

      minOrderValue: rawMinOrderValue
        ? Math.round(Number(rawMinOrderValue) * 100)
        : undefined,

      maxUses: formData.get("maxUses")
        ? Number(formData.get("maxUses"))
        : undefined,

      expiresAt: formData.get("expiresAt")
        ? new Date(formData.get("expiresAt") as string)
        : undefined,

      productIds: scope === "PRODUCTS" ? productIds : undefined,
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

    } = result.data

    await updateCoupon({
      id: couponId,
      code,
      expiresAt,
      isActive,
      maxUses,
      minOrderValue,
      value,
      type,
      scope,
      productIds
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
  const result = deleteCouponSchema.safeParse(Object.fromEntries(data))
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors);
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


