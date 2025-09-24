"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Edit, Eye, MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const products = [
  {
    id: 1,
    name: "Tênis Urbano Premium",
    sku: "TENIS-001",
    category: "Tênis",
    price: 299.9,
    stock: 45,
    status: "Ativo",
    image: "/placeholder.svg?height=60&width=60&text=Tênis",
    sales: 156,
  },
  {
    id: 2,
    name: "Sapato Social Clássico",
    sku: "SOCIAL-002",
    category: "Sapatos Sociais",
    price: 189.9,
    stock: 23,
    status: "Ativo",
    image: "/placeholder.svg?height=60&width=60&text=Social",
    sales: 89,
  },
  {
    id: 3,
    name: "Bota Coturno Feminina",
    sku: "BOTA-003",
    category: "Botas",
    price: 159.9,
    stock: 8,
    status: "Baixo Estoque",
    image: "/placeholder.svg?height=60&width=60&text=Bota",
    sales: 67,
  },
  {
    id: 4,
    name: "Sandália Comfort",
    sku: "SAND-004",
    category: "Sandálias",
    price: 89.9,
    stock: 0,
    status: "Esgotado",
    image: "/placeholder.svg?height=60&width=60&text=Sandália",
    sales: 234,
  },
  {
    id: 5,
    name: "Chinelo Slide Premium",
    sku: "CHIN-005",
    category: "Chinelos",
    price: 49.9,
    stock: 67,
    status: "Ativo",
    image: "/placeholder.svg?height=60&width=60&text=Chinelo",
    sales: 123,
  },
]

const categories = ["Todos", "Tênis", "Sapatos Sociais", "Botas", "Sandálias", "Chinelos"]
const statusOptions = ["Todos", "Ativo", "Baixo Estoque", "Esgotado", "Inativo"]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("Todos")

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "Ativo" && stock > 10) {
      return <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>
    } else if (status === "Baixo Estoque" || (stock > 0 && stock <= 10)) {
      return <Badge className="bg-amber-100 text-amber-700 border-0">Baixo Estoque</Badge>
    } else if (status === "Esgotado" || stock === 0) {
      return <Badge className="bg-red-100 text-red-700 border-0">Esgotado</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-0">Inativo</Badge>
    }
  }

  const getStockIcon = (stock: number) => {
    if (stock === 0) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    } else if (stock <= 10) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />
    } else {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "Todos" || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1.234</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1.156</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Baixo Estoque</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esgotados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Lista de Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStockIcon(product.stock)}
                        <span className="text-sm">{product.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.sales}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
