import { api } from "./api-client";

export interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  cpf: string | null;
  city: string | null;
  state: string | null;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: string;
  joinDate: Date;
}

interface GetCustomersResponse {
  customers: Customer[]
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}


interface GetCustomersParams {
  page?: number;
  limit?: number;
  status?: "inactive" | "active";
  search?: string;
}

export async function getCustomers(params?: GetCustomersParams) {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);

  const url = `customers?${query.toString()}`;
  const result = await api.get(url).json<GetCustomersResponse>()
  return result

}