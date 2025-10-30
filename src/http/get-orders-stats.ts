import { api } from "./api-client";

type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DELIVERED" | "all"

interface GetOrdersStatsResponse {
  date: string;
  status: OrderStatus;
  quantity: number;
  total: number;
  previousQuantity: number;
  previousTotal: number;
  changeQuantity: string;
  changeTotal: string;
}

interface GetOrdersStatsParams {
  date?: string;
  status?: OrderStatus;
}

export async function getOrdersStats(params?: GetOrdersStatsParams) {
  const query = new URLSearchParams();
  if (params?.date) query.set("date", params.date);
  if (params?.status && params.status !== 'all')
    query.set("status", params.status);

  const url = `orders/stats${query.toString() ? `?${query.toString()}` : ""}`;
  const result = await api.get(url).json<GetOrdersStatsResponse>();
  return result;
}