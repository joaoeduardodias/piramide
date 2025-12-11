"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useFormState } from "@/hooks/use-form-state"
import { useOrders, type Order, type OrderStatus } from "@/http/get-orders"
import { queryClient } from "@/lib/query-client"
import { formatCEP, formatReal } from "@/lib/validations"
import { formatPhone } from "@/utils/format-phone"
import {
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Loader2,
  Package,
  Search,
  Settings,
  XCircle
} from "lucide-react"
import { useState } from "react"
import { updateOrderAction } from "../actions"


export function ListOrders() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order>()
  const [formStatus, setFormStatus] = useState<string>("")
  const [formPaymentMethod, setFormPaymentMethod] = useState<string>("")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const status = statusFilter === 'all' ? undefined : statusFilter.toUpperCase() as OrderStatus
  const { data, isLoading, isError, error } = useOrders({ page, limit: itemsPerPage, status })
  const orders = data?.orders ?? []
  const totalPages = data?.pagination.totalPages ?? 0

  const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
    PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    CONFIRMED: { label: "Confirmado", color: "bg-orange-100 text-orange-800", icon: Check },
    PROCESSING: { label: "Processando", color: "bg-purple-100 text-purple-800", icon: Package },
    DELIVERED: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
  }

  const paymentMethodLabels: Record<string, string> = {
    CREDIT: "Cartão de Crédito",
    PIX: "PIX",
    DEBIT: "Cartão de Débito",
  }
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer?.name && order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.number).includes(searchTerm.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateOrderAction,
    () => {
      setEditDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['orders', { page: 1, limit: 10 }] })
    }
  )


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
                          <DialogContent className="w-[95vw] max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Pedido -  {selectedOrder?.number}</DialogTitle>
                              <DialogDescription>Informações completas do pedido</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-w-full">
                              <div className="grid grid-cols-2 gap-4 max-w-full">
                                <div className="max-w-full">
                                  <Label>Cliente</Label>
                                  <p className="text-sm break-words whitespace-normal max-w-full">{order.customer?.name}</p>
                                </div>
                                <div className="max-w-full">
                                  <Label>Email</Label>
                                  <p className="text-sm break-words whitespace-normal max-w-full">{order.customer?.email}</p>
                                </div>
                                {order.customer?.phone && (
                                  <div className="space-y-2 max-w-full">
                                    <Label>Telefone</Label>
                                    <p className="text-sm break-words whitespace-normal max-w-full">{formatPhone(order.customer?.phone)}</p>
                                  </div>
                                )}
                                <div className="space-y-2 max-w-full">
                                  <Label>Data</Label>
                                  <p className="text-sm ">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              <div className="space-y-2 max-w-full">
                                <Label>Endereço de Entrega</Label>
                                <p className="text-sm capitalize break-words whitespace-normal max-w-full">{`${order.address?.name} - ${order.address?.street}, ${order.address?.number}, ${order.address?.district}, ${order.address?.city}, ${formatCEP(String(order.address?.postalCode))} - ${order.address?.state}`}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground mb-3 block">Itens do Pedido</Label>
                                <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-4 pb-3 border-b last:border-b-0 last:pb-0"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.product.brandName}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                          {Object.entries(item.options).map(([key, value]) => (
                                            <Badge key={key} variant="secondary" className="text-xs">
                                              {key}: {value.name}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">{formatReal(String(item.unitPrice))}</p>
                                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-muted-foreground">Forma de Pagamento</Label>
                                  <p className="font-medium">{paymentMethodLabels[order.paymentMethod]}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Status</Label>
                                  <div className="mt-1">
                                    <Badge className={statusConfig[order.status].color}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {statusConfig[order.status].label}
                                    </Badge>
                                  </div>
                                </div>
                                {order.trackingCode && (
                                  <div>
                                    <Label className="text-muted-foreground">Código de Rastreio</Label>
                                    <p className="font-medium font-mono">{order.trackingCode}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2 max-w-full">
                                <Label>Status</Label>
                                <Badge className={statusConfig[order.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[order.status].label}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={editDialogOpen && editingOrder?.id === order.id}
                          onOpenChange={(open) => {
                            setEditDialogOpen(open)
                            if (!open) setEditingOrder(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingOrder(order)
                                setFormPaymentMethod(order.paymentMethod)
                                setFormStatus(order.status)
                                setEditDialogOpen(true)
                              }}
                            >
                              <Edit className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar Pedido - {order.number}</DialogTitle>
                              <DialogDescription className="sr-only">Altere as informações do pedido</DialogDescription>
                            </DialogHeader>
                            {
                              success === false && message && (
                                <Alert variant="destructive">
                                  <AlertTriangle className="size-4" />
                                  <AlertTitle>Erro Encontrado</AlertTitle>
                                  <AlertDescription>
                                    <p>{message}</p>
                                  </AlertDescription>
                                </Alert>
                              )
                            }
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                              <input type="hidden" name="id" value={order.id} />
                              <input type="hidden" name="status" value={formStatus} />
                              <input type="hidden" name="paymentMethod" value={formPaymentMethod} />
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                  <Label className="text-muted-foreground text-xs">Status Atual</Label>
                                  <Badge className={`mt-1 ${statusConfig[order.status].color}`}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <Label className="text-muted-foreground text-xs">Última Atualização</Label>
                                  <p className="text-sm font-medium">{new Date(order.updatedAt).toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="status">Status do Pedido</Label>
                                <Select
                                  name="status"
                                  value={formStatus}
                                  onValueChange={(v) => setFormStatus(v)}
                                >
                                  <SelectTrigger id="status">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">
                                      <div className="flex items-center gap-2">
                                        <Clock className="size-4 text-yellow-600" />
                                        Pendente
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="PROCESSING">
                                      <div className="flex items-center gap-2">
                                        <Settings className="size-4 text-yellow-600" />
                                        Processando
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="CONFIRMED">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="size-4 text-blue-600" />
                                        Confirmado
                                      </div>
                                    </SelectItem>

                                    <SelectItem value="DELIVERED">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="size-4 text-green-600" />
                                        Entregue
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                      <div className="flex items-center gap-2">
                                        <XCircle className="size-4 text-red-600" />
                                        Cancelado
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors?.status && (
                                  <p className="text-xs ml-1 text-red-600">{errors.status[0]}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                                <Select
                                  name="paymentMethod"
                                  value={formPaymentMethod}
                                  onValueChange={(v) => setFormPaymentMethod(v)}

                                >
                                  <SelectTrigger id="paymentMethod">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="CREDIT">Cartão de Crédito</SelectItem>
                                    <SelectItem value="PIX">PIX</SelectItem>
                                    <SelectItem value="DEBIT">Cartão de Débito</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors?.paymentMethod && (
                                  <p className="text-xs ml-1 text-red-600">{errors.paymentMethod[0]}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="trackingCode">Código de Rastreio</Label>
                                <Input
                                  id="trackingCode"
                                  name="trackingCode"
                                  placeholder="Ex: BR123456789"
                                  defaultValue={order.trackingCode || ""}
                                  onChange={(e) => {
                                    e.target.value = e.target.value.toUpperCase()
                                  }}
                                  className="font-mono"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Informe o código de rastreio quando o pedido for enviado
                                </p>
                                {errors?.trackingCode && (
                                  <p className="text-xs ml-1 text-red-600">{errors.trackingCode[0]}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="estimatedDelivery">Previsão de Entrega</Label>
                                <Input
                                  id="estimatedDelivery"
                                  name="estimatedDelivery"
                                  type="date"
                                  defaultValue={order.estimatedDelivery || ""}
                                />
                                {errors?.estimatedDelivery && (
                                  <p className="text-xs ml-1 text-red-600">{errors.estimatedDelivery[0]}</p>
                                )}
                              </div>
                              <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditDialogOpen(false)}
                                  disabled={isPending}
                                >
                                  Cancelar
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                  {isPending ? (
                                    <>
                                      <Loader2 className="size-4 mr-2 animate-spin" />
                                      Salvando...
                                    </>
                                  ) : (
                                    "Salvar Alterações"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
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