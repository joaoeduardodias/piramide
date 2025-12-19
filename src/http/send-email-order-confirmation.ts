import { api } from "./api-client";


interface SendEmailOrderConfirmationRequest {
  orderId: string
}

export async function sendEmailOrderConfirmation({ orderId }: SendEmailOrderConfirmationRequest) {
  const result = await api.post(`emails/order-created/${orderId}`,)
  return result
}