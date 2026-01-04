import { api } from "./api-client";



interface UpdateCouponRequest {
  id: string
  code: string
  type: 'PERCENT' | 'FIXED'
  productIds?: string[] | undefined
  scope: "ALL_PRODUCTS" | "PRODUCTS";
  isActive: boolean
  value: number
  minOrderValue?: number
  maxUses?: number
  expiresAt?: Date
}


export async function updateCoupon({
  id,
  code,
  isActive,
  type,
  value,
  expiresAt,
  maxUses,
  minOrderValue,
  scope,
  productIds
}: UpdateCouponRequest) {
  const result = await api.put(`coupons/${id}`, {
    json: {
      code,
      isActive,
      type,
      value,
      expiresAt,
      maxUses,
      minOrderValue,
      scope,
      productIds
    }
  }).json()
  return result
}