import { api } from "./api-client";



interface UpdateStatusCouponRequest {
  id: string

}


export async function updateStatusCoupon({ id }: UpdateStatusCouponRequest) {
  const result = await api.put(`coupons/${id}/status`).json()
  return result
}