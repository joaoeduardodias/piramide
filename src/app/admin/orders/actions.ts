"use server"

import { updateOrder } from "@/http/update-order"
import { HTTPError } from "ky"
import { updateTag } from "next/cache"
import z from "zod/v4"

const updateStatusOrderSchema = z.object({
  id: z.uuid(),
  paymentMethod: z.enum(["CREDIT", "DEBIT", "PIX", "MONEY"]),
  trackingCode: z.string().nullish(),
  estimatedDelivery: z.string().nullish(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED", "PROCESSING"])
})


export async function updateOrderAction(data: FormData) {
  try {
    const result = updateStatusOrderSchema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);
      return { success: false, message: null, errors }
    };
    const { id, status, paymentMethod, estimatedDelivery, trackingCode } = result.data

    await updateOrder({ id, status, paymentMethod, estimatedDelivery, trackingCode })

    updateTag("orders")


  } catch (err: any) {
    console.log(err);
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: "Erro ao atualizar pedido, Tente novamente.",
      errors: null
    }
  }
  return {
    success: true,
    message: null,
    errors: null,
  }
}



