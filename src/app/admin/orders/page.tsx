"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, DollarSign, Edit, Eye, Filter, Package, Search, Truck, XCircle } from "lucide-react"
import { useState } from "react"

const orders = [
  {
    id: "#001",
    customer: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    total: 299.9,
    status: "pending",
    date: "2024-01-15",
    items: 2,
    address: "Rua das Flores, 123 - São Paulo, SP",
  },
  {
    id: "#002",
    customer: "João Santos",
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    total: 459.8,
    status: "processing",
    date: "2024-01-14",
    items: 3,
    address: "Av. Paulista, 456 - São Paulo, SP",
  },
  {
    id: "#003",
    customer: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 77777-7777",
    total: 189.9,
    status: "shipped",
    date: "2024-01-13",
    items: 1,
    address: "Rua Augusta, 789 - São Paulo, SP",
  },
  {
    id: "#004",
    customer: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 66666-6666",
    total: 599.7,
    status: "delivered",
    date: "2024-01-12",
    items: 4,
    address: "Rua Oscar Freire, 321 - São Paulo, SP",
  },
  {
    id: "#005",
    customer: "Carla Mendes",
    email: "carla@email.com",
    phone: "(11) 55555-5555",
    total: 129.9,
    status: "cancelled",
    date: "2024-01-11",
    items: 1,
    address: "Rua da Consolação, 654 - São Paulo, SP",
  },
]

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Processando", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processando</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, pedido ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Lista de Pedidos</CardTitle>
          <CardDescription>{filteredOrders.length} pedido(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Items</TableHead>
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
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{order.items} item(s)</TableCell>
                    <TableCell className="font-medium text-green-600">R$ {order.total.toFixed(2)}</TableCell>
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
                              <Eye className="h-4 w-4" />
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
                                  <Label className="text-sm font-medium text-gray-700">Cliente</Label>
                                  <p className="text-gray-900">{order.customer}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                                  <p className="text-gray-900">{order.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                                  <p className="text-gray-900">{order.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Data</Label>
                                  <p className="text-gray-900">{new Date(order.date).toLocaleDateString("pt-BR")}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Endereço de Entrega</Label>
                                <p className="text-gray-900">{order.address}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                <Badge className={statusConfig[order.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[order.status].label}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Atualizar Status</Label>
                                <Select defaultValue={order.status}>
                                  <SelectTrigger className="border-gray-300">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="processing">Processando</SelectItem>
                                    <SelectItem value="shipped">Enviado</SelectItem>
                                    <SelectItem value="delivered">Entregue</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
