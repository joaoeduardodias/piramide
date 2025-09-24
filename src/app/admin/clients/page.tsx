"use client"

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
import { DollarSign, Edit, Eye, Filter, Plus, Search, ShoppingBag, Users } from "lucide-react"
import { useState } from "react"

const customers = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    city: "São Paulo",
    state: "SP",
    orders: 5,
    totalSpent: 1299.5,
    lastOrder: "2024-01-15",
    status: "active",
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    city: "Rio de Janeiro",
    state: "RJ",
    orders: 3,
    totalSpent: 899.7,
    lastOrder: "2024-01-10",
    status: "active",
    joinDate: "2023-08-22",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 77777-7777",
    city: "Belo Horizonte",
    state: "MG",
    orders: 8,
    totalSpent: 2150.3,
    lastOrder: "2024-01-12",
    status: "vip",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 66666-6666",
    city: "Salvador",
    state: "BA",
    orders: 1,
    totalSpent: 299.9,
    lastOrder: "2023-12-20",
    status: "inactive",
    joinDate: "2023-12-15",
  },
  {
    id: 5,
    name: "Carla Mendes",
    email: "carla@email.com",
    phone: "(11) 55555-5555",
    city: "Porto Alegre",
    state: "RS",
    orders: 12,
    totalSpent: 3450.8,
    lastOrder: "2024-01-14",
    status: "vip",
    joinDate: "2023-01-05",
  },
]

const statusConfig = {
  active: { label: "Ativo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800" },
}

export default function ClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue:
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orders, 0),
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center mt-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
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
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VIP</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-600">R$ {stats.avgOrderValue.toFixed(2)}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-400" />
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
                placeholder="Buscar por nome, email ou cidade..."
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
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
          <CardDescription>{filteredCustomers.length} cliente(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{customer.city}</p>
                      <p className="text-sm text-gray-500">{customer.state}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{customer.orders}</TableCell>
                  <TableCell className="font-medium text-green-600">R$ {customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{new Date(customer.lastOrder).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    {/* <Badge className={statusConfig[customer.status].color}>{statusConfig[customer.status].label}</Badge> */}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => setSelectedCustomer(customer)}
                            className="border-gray-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Perfil do Cliente</DialogTitle>
                            <DialogDescription>Informações detalhadas do cliente</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Nome</Label>
                                <p className="text-gray-900">{customer.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Email</Label>
                                <p className="text-gray-900">{customer.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                                <p className="text-gray-900">{customer.phone}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Localização</Label>
                                <p className="text-gray-900">
                                  {customer.city}, {customer.state}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Data de Cadastro</Label>
                                <p className="text-gray-900">
                                  {new Date(customer.joinDate).toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Status</Label>
                                {/* <Badge className={statusConfig[customer.status].color}>
                                  {statusConfig[customer.status].label}
                                </Badge> */}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{customer.orders}</p>
                                <p className="text-sm text-gray-600">Pedidos</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">R$ {customer.totalSpent.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Total Gasto</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                  R$ {(customer.totalSpent / customer.orders).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">Ticket Médio</p>
                              </div>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
