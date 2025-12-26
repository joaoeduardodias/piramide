"use server"

import { createOrder } from "@/http/create-order";
import { sendEmailOrderConfirmation } from "@/http/send-email-order-confirmation";
import { HTTPError } from "ky";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";


const createOrderSchema = z.object({
  paymentMethod: z.enum(["PIX", "CREDIT", "DEBIT", "MONEY"], {
    message: "Selecione o método de pagamento.",
  }),
  addressId: z.uuid("Selecione o endereço"),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.uuid(),
      variantId: z.uuid().optional(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().positive(),
    }),
  ),
})





export async function createOrderAction(data: FormData) {
  let order: string
  try {
    const dataItems = data.get('items') as string
    const formattedItems = JSON.parse(dataItems)

    const rawData = Object.fromEntries(data.entries());

    const formattedData = {
      ...rawData,
      items: formattedItems
    }

    const result = createOrderSchema.safeParse(formattedData);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      console.log(errors);
      return { success: false, message: null, errors }
    };

    const { addressId, items, paymentMethod, couponCode } = result.data
    const { orderId } = await createOrder({ addressId, items, paymentMethod, status: "PENDING", couponCode })
    order = orderId
    await sendEmailOrderConfirmation({ orderId })

    updateTag('orders')
  } catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: "Erro ao criar pedido.",
      errors: null
    }
  }
  redirect(`/auth/order-confirmation/${order}`)

}