import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";
export type OrderStatus = "PENDING" | "CANCELLED" | "CONFIRMED" | "DELIVERED" | "PROCESSING"
export type PaymentMethod = "CREDIT" | "DEBIT" | "PIX" | "MONEY"


export interface Order {
  id: string;
  number: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  estimatedDelivery: string | null;
  total: number;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
  trackingCode: string | null;
  customer: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    cpf: string | null;
  } | null;
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
}

interface GetOrders {
  orders: Order[]
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  customerId?: string;
}

export async function getOrders(params?: GetOrdersParams) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.search) query.set("search", params.search);
  if (params?.customerId) query.set("customerId", String(params.customerId));
  if (params?.startDate) query.set("startDate", String(params.startDate));
  if (params?.endDate) query.set("endDate", (params.endDate));

  const url = `orders${query.toString() ? `?${query.toString()}` : ""}`;

  const result = await api.get(url, { next: { tags: ['orders'] } }).json<GetOrders>()
  return result
}


export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  })
}