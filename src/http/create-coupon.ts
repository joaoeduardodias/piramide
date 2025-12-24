import { api } from "./api-client";



interface CreateCouponRequest {
  code: string;
  type: "PERCENT" | "FIXED";
  isActive: boolean;
  value: number;
  minOrderValue?: number | undefined;
  maxUses?: number | undefined;
  expiresAt?: string | undefined;
}
interface CreateCouponResponse {
  couponId: string
}

export async function createCoupon({
  code,
  isActive,
  type,
  value,
  expiresAt,
  maxUses,
  minOrderValue
}: CreateCouponRequest) {
  const result = await api.post('coupons', {
    json: {
      code,
      isActive,
      type,
      value,
      expiresAt,
      maxUses,
      minOrderValue
    }
  }).json<CreateCouponResponse>()
  return result
}