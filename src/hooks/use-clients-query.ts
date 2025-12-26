
import { getCustomers } from "@/http/get-customers"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useClientsQuery({
  page,
  limit,
  status,
  search,
}: {
  page: number
  limit: number
  status?: "inactive" | "active"
  search?: string
}) {
  return useSuspenseQuery({
    queryKey: ["orders", { page, limit, status, search }],
    queryFn: () => getCustomers({ page, limit, status, search }),
    staleTime: 1000 * 30,
  })
}
