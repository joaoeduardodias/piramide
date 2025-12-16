import { api } from "./api-client";
import type { OrderStatus, PaymentMethod } from "./get-orders";


interface GetOrdersByUserResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
  orders: {
    total: number;
    itemsCount: number;
    customer: {
      id: string;
      email: string;
      name: string | null;
    } | null;
    number: number;
    status: OrderStatus
    id: string;
    createdAt: Date;
    updatedAt: Date;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      product: {
        id: string;
        name: string;
        slug: string;
        brandName: string | null;
      };
      options: {
        id: string;
        name: string;
        optionId: string;
      }[];
    }[];
    address: {
      number: string | null;
      name: string;
      street: string;
      complement: string | null;
      district: string | null;
      city: string;
      state: string;
      postalCode: string;
    } | null;
    paymentMethod: PaymentMethod;
    trackingCode: string | null;
    estimatedDelivery: Date | null;
    addressId: string | null;
  }[]
}


export async function getOrdersByUser() {
  const result = await api.get(`orders/customer`).json<GetOrdersByUserResponse>()
  return result
}