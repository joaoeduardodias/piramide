import { api } from "./api-client";

interface CreateOrderRequest {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED'
  addressId: string
  items: {
    productId: string
    variantId?: string
    quantity: number
    unitPrice: number
  }[]
}
interface CreateOrderResponse {
  orderNumber: number
}

export async function createOrder({ addressId, status, items }: CreateOrderRequest) {
  const result = await api.post('orders', { json: { addressId, status, items } }).json<CreateOrderResponse>()
  return result
}