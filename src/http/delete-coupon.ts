import { api } from "./api-client";


interface DeleteCouponRequest {
  id: string
}

export async function deleteCoupon({ id }: DeleteCouponRequest) {
  const result = await api.delete(`coupons/${id}`)
  return result
}