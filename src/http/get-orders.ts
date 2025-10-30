import { api } from "./api-client";

export interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED";
  total: number;
  itemsCount: number;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    email: string;
    name: string | null;
  } | null;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      id: string;
      name: string;
      slug: string;
    };
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

export async function getOrders() {
  const result = await api.get('orders').json<GetOrders>()
  return result
}