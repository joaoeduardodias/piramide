"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useOrders, type Order } from "@/http/get-orders"
import { formatReal } from "@/lib/validations"
import { formatPhone } from "@/utils/format-phone"
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Search,
  Truck,
  XCircle
} from "lucide-react"
import { useState } from "react"
import type { OrderStatus } from "../page"


export interface ListOrdersProps {
  orders: Order[]
}

export function ListOrders({ orders: initialOrders }: ListOrdersProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  // const { data, isLoading, isError } = useOrders({ page, limit: itemsPerPage, customerId, endDate, search, startDate, status })
  const status = statusFilter === 'all' ? undefined : statusFilter.toUpperCase() as OrderStatus
  const { data, isLoading, isError, error } = useOrders({ page, limit: itemsPerPage, status })
  const orders = data?.orders ?? initialOrders ?? []
  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 0

  const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
    PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    CONFIRMED: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
    DELIVERED: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer?.name && order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.number).includes(searchTerm.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (isLoading) return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  if (isError) return (
    <Card className="border-0 shadow-sm">
      <CardContent>
        <div className="space-y-4">
          <p>Erro encontrado!</p>
          <span>{error.message}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Card className="border border-gray-200">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input
              placeholder="Buscar por cliente, pedido ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <Filter className="size-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Enviado</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>{filteredOrders.length} pedido(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer?.name}</p>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{order.itemsCount} item(s)</TableCell>
                    <TableCell className="font-medium text-green-600">{formatReal(String(order.total))}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[order.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="border-gray-300"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Pedido {order.id}</DialogTitle>
                              <DialogDescription>Informações completas do pedido</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Cliente</Label>
                                  <p>{order.customer?.name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p>{order.customer?.email}</p>
                                </div>
                                {order.customer?.phone && (
                                  <div>
                                    <Label>Telefone</Label>
                                    <p>{formatPhone(order.customer?.phone)}</p>
                                  </div>
                                )}
                                <div>
                                  <Label>Data</Label>
                                  <p>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Endereço de Entrega</Label>
                                <p>{`${order.address?.name} - ${order.address?.street}, ${order.address?.number}, ${order.address?.district}, ${order.address?.city}, ${order.address?.postalCode}`}</p>
                                <p>{`${order.address?.state}`}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={statusConfig[order.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[order.status].label}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                          <Edit className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-between gap-4">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href=""
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 3 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < totalPages) setPage(page + 1)
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </>
  )
}