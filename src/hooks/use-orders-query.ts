
import type { OrderStatus } from "@/http/get-orders"
import { getOrders } from "@/http/get-orders"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useOrdersQuery({
  page,
  limit,
  status,
  search,
}: {
  page: number
  limit: number
  status?: OrderStatus
  search?: string
}) {
  return useSuspenseQuery({
    queryKey: ["orders", { page, limit, status, search }],
    queryFn: () => getOrders({ page, limit, status, search }),
    staleTime: 1000 * 30,
  })
}
