import { api } from "./api-client";
import type { OrderStatus, PaymentMethod } from "./get-orders";

interface CreateOrderRequest {
  status: OrderStatus
  paymentMethod: PaymentMethod
  addressId: string
  items: {
    productId: string
    variantId?: string
    quantity: number
    unitPrice: number
  }[]
}
interface CreateOrderResponse {
  orderId: string
}

export async function createOrder({ addressId, status, items, paymentMethod }: CreateOrderRequest) {
  const result = await api.post('orders', { json: { addressId, status, items, paymentMethod } }).json<CreateOrderResponse>()
  return result
}