import { useMutation } from "@tanstack/react-query";
import { api } from "./api-client";


interface ValidadeCouponRequest {
  code: string,
  orderTotal: number,
  productIds: string[]
}
interface ValidadeCouponResponse {
  total: number,
  discount: number,
}

export async function validadeCoupon({ code, orderTotal, productIds }: ValidadeCouponRequest) {
  const result = await api.post(`coupons/validate`, { json: { code, orderTotal, productIds } }).json<ValidadeCouponResponse>()
  return result
}


export function useValidateCoupon() {
  return useMutation({
    mutationFn: validadeCoupon,
  })
}
