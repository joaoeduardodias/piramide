"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { Pagination } from "@/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebouncedValue } from "@/hooks/use-debounced-search"
import { useFormState } from "@/hooks/use-form-state"
import { useFuseSearch } from "@/hooks/use-fuse-search"
import { useOrdersQuery } from "@/hooks/use-orders-query"
import type { OrderStatus } from "@/http/get-orders"
import { queryClient } from "@/lib/query-client"
import { formatReal } from "@/lib/validations"
import { statusConfig } from "@/utils/badge-status-order"
import { formatPhone } from "@/utils/format-phone"
import { paymentMethodLabels } from "@/utils/payment-method-labels"
import { AlertTriangle, CheckCircle, Clock, Edit, Eye, Loader2, Package, Truck, XCircle } from "lucide-react"
import { useState } from "react"
import { updateOrderAction } from "../actions"
export type OrderStatusFilter = "all" | OrderStatus

interface Props {
  search: string
  statusFilter: OrderStatusFilter
  page: number
  setPage: (v: number) => void
  itemsPerPage: number
  setItemsPerPage: (v: number) => void
}

export function ListOrdersTableContent({
  search,
  statusFilter,
  page,
  itemsPerPage,
  setPage,
  setItemsPerPage,
}: Props) {


  const debouncedSearch = useDebouncedValue(search, 400)
  const shouldSearchOnServer = debouncedSearch.length >= 3
  const { data } = useOrdersQuery({
    page,
    limit: itemsPerPage,
    search: shouldSearchOnServer ? debouncedSearch : undefined,
  })

  const totalPages = data?.pagination?.totalPages || 1
  const orders = data?.orders || []

  const { results: fuseResults } = useFuseSearch({
    data: orders,
    search,
    keys: [
      "customer.name",
      "customer.email",
      "number",
    ],
  })

  const filteredOrders =
    search && !shouldSearchOnServer
      ? fuseResults
      : orders

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(updateOrderAction, () => {
      queryClient.invalidateQueries({
        queryKey: ["orders", { page, limit: itemsPerPage, status, search }],
      })
    })

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [formStatus, setFormStatus] = useState<string>("")
  const [formPaymentMethod, setFormPaymentMethod] = useState<string>("")

  return (
    <>


      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {orders.length} pedido(s) encontrado(s)
          </CardDescription>
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
                    <TableCell>#{order.number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </TableCell>
                    <TableCell>{order.itemsCount} item(s)</TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatReal(String(order.total))}
                    </TableCell>
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
                              className="border-gray-300"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Pedido - {order.number}</DialogTitle>
                              <DialogDescription>Informações completas do pedido</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2  gap-4">
                                <div>
                                  <Label className="text-muted-foreground">Cliente</Label>
                                  <p className="font-medium">{order.customer?.name}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <Label className="text-muted-foreground">Email</Label>
                                  <p className="font-medium">{order.customer?.email}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Telefone</Label>
                                  <p className="font-medium">{formatPhone(String(order.customer?.phone))}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <Label className="text-muted-foreground">Data do Pedido</Label>
                                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-muted-foreground">Endereço de Entrega</Label>
                                <p className="font-medium">
                                  {order.address?.street}, {order.address?.number}
                                  {order.address?.complement && ` - ${order.address.complement}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.address?.district}, {order.address?.city} - {order.address?.state},{" "}
                                  {order.address?.postalCode}
                                </p>
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
                                              {value.name}
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

                              <div className="flex justify-between gap-4">
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
                                {order.estimatedDelivery && (
                                  <div>
                                    <Label className="text-muted-foreground">Previsão de Entrega</Label>
                                    <p className="font-medium">
                                      {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>{formatReal(String(order.total))}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Frete</span>
                                  <span>Grátis</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                  <span>Total</span>
                                  <span className="text-green-600">{formatReal(String(order.total))}</span>
                                </div>
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
                                  <SelectTrigger className="w-full!" id="status">
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
                                        <Package className="size-4  text-purple-800" />
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
                                        <Truck className="size-4 text-green-600" />
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
                                  <SelectTrigger className="w-full!" id="paymentMethod">
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

        <CardFooter className="w-full">
          <Pagination
            itemsPerPage={itemsPerPage}
            page={page}
            setItemsPerPage={setItemsPerPage}
            setPage={setPage}
            totalPages={totalPages}
          />
        </CardFooter>
      </Card>
    </>
  )
}
