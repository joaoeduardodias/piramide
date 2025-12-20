"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import type { OrderStatusFilter } from "./list-orders"
import { ListOrdersTableContent } from "./list-orders-table-content"

interface Props {
  search: string
  statusFilter: OrderStatusFilter
  page: number
  setPage: (v: number) => void
  itemsPerPage: number
  setItemsPerPage: (v: number) => void
}

export function ListOrdersTable(props: Props) {
  return (
    <Suspense fallback={<Skeleton className="h-[300px] rounded-md" />}>
      <ListOrdersTableContent {...props} />
    </Suspense>
  )
}
