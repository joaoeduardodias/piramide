import { api } from "./api-client";
import type { OrderStatus, PaymentMethod } from "./get-orders";


interface UpdateOrderRequest {
  id: string;
  status: OrderStatus
  paymentMethod: PaymentMethod
  trackingCode?: string | null
  estimatedDelivery?: string | null
}

export async function updateOrder({ status, id, paymentMethod, estimatedDelivery, trackingCode }: UpdateOrderRequest) {
  const result = await api.put(`orders/${id}`, { json: { status, paymentMethod, estimatedDelivery, trackingCode } })
  return result
}