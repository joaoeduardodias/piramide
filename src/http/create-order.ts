import { apiClient } from "./api-client-components";

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
  orderId: string
}

export async function createOrder({ addressId, status, items }: CreateOrderRequest) {
  const result = await apiClient.post('orders', { json: { addressId, status, items } }).json<CreateOrderResponse>()
  return result
}