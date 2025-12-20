"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { OrderStatus } from "@/http/get-orders"
import { useState } from "react"
import { ListOrdersTable } from "./list-orders-table"
import { OrdersFilters } from "./orders-filters"

export type OrderStatusFilter = "all" | OrderStatus

export function ListOrders() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<OrderStatusFilter>("all")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  return (
    <>
      <Card className="border border-gray-200">
        <CardContent>
          <OrdersFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            onStatusChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          />
        </CardContent>
      </Card>



      <ListOrdersTable
        search={search}
        statusFilter={statusFilter}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </>
  )
}
