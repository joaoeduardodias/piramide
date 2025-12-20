"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import type { OrderStatusFilter } from "./list-orders-table-content"

interface OrdersFiltersProps {
  search: string
  statusFilter: OrderStatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderStatusFilter) => void

}

export function OrdersFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: OrdersFiltersProps) {
  return (
    <div className="p-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        <Input
          placeholder="Buscar por cliente, pedido ou email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-300"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-48 border-gray-300">
          <Filter className="size-4 mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="PENDING">Pendente</SelectItem>
          <SelectItem value="PROCESSING">Processando</SelectItem>
          <SelectItem value="CONFIRMED">Confirmado</SelectItem>
          <SelectItem value="DELIVERED">Entregue</SelectItem>
          <SelectItem value="CANCELLED">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
