import { api } from "./api-client";
import type { OrderStatus, PaymentMethod } from "./get-orders";


interface GetOrderByIdResponse {
  order: {
    id: string;
    number: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    trackingCode: string | null;
    estimatedDelivery: Date | null;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      options: {
        id: string;
        name: string;
        optionId: string;
      }[];
      product: {
        id: string;
        name: string;
        slug: string;
        brand: {
          name: string;
        } | null;
      };
    }[];
    itemsCount: number;
    createdAt: Date;
    updatedAt: Date;
    customer: {
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      cpf: string | null;
    } | null;
    address: {
      number: string | null
      name: string
      street: string
      complement: string | null
      district: string | null
      city: string
      state: string
      postalCode: string
    } | null;
  };
  total: number;
  itemsCount: number;

}
interface GetOrderByIdRequest {
  id: string
}

export async function getOrderById({ id }: GetOrderByIdRequest) {
  const result = await api.get(`orders/${id}`).json<GetOrderByIdResponse>()
  return result

}