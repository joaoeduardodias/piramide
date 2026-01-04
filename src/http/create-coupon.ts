import { api } from "./api-client";



interface CreateCouponRequest {
  code: string;
  type: "PERCENT" | "FIXED";
  scope: "ALL_PRODUCTS" | "PRODUCTS";
  isActive: boolean;
  value: number;
  minOrderValue?: number | undefined;
  maxUses?: number | undefined;
  expiresAt?: string | undefined;
  productIds?: string[] | undefined
}
interface CreateCouponResponse {
  couponId: string
}

export async function createCoupon({
  code,
  isActive,
  type,
  value,
  scope,
  expiresAt,
  maxUses,
  minOrderValue,
  productIds,
}: CreateCouponRequest) {
  const result = await api.post('coupons', {
    json: {
      code,
      isActive,
      type,
      value,
      scope,
      expiresAt,
      maxUses,
      productIds,
      minOrderValue
    }
  }).json<CreateCouponResponse>()
  return result
}