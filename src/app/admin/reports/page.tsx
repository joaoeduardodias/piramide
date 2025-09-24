"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Package,
  PieChartIcon,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react"
import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const salesData = [
  { month: "Jan", vendas: 12000, pedidos: 45, clientes: 32 },
  { month: "Fev", vendas: 15000, pedidos: 52, clientes: 38 },
  { month: "Mar", vendas: 18000, pedidos: 61, clientes: 45 },
  { month: "Abr", vendas: 22000, pedidos: 78, clientes: 52 },
  { month: "Mai", vendas: 25000, pedidos: 85, clientes: 58 },
  { month: "Jun", vendas: 28000, pedidos: 92, clientes: 65 },
]

const categoryData = [
  { name: "Tênis Esportivos", value: 35, color: "#3B82F6" },
  { name: "Sapatos Sociais", value: 25, color: "#10B981" },
  { name: "Sandálias", value: 20, color: "#F59E0B" },
  { name: "Botas", value: 15, color: "#EF4444" },
  { name: "Chinelos", value: 5, color: "#8B5CF6" },
]

const topProducts = [
  { name: "Nike Air Max", sales: 156, revenue: 23400 },
  { name: "Adidas Ultraboost", sales: 142, revenue: 21300 },
  { name: "Vans Old Skool", sales: 128, revenue: 19200 },
  { name: "Converse All Star", sales: 115, revenue: 17250 },
  { name: "Puma Suede", sales: 98, revenue: 14700 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() })
  const [period, setPeriod] = useState("month")

  const stats = {
    totalRevenue: 120000,
    totalOrders: 413,
    totalCustomers: 290,
    totalProducts: 156,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    productsGrowth: 5.1,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada do desempenho da loja</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 border-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-300 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{stats.revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">+{stats.ordersGrowth}%</span>
                </div>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">+{stats.customersGrowth}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">+{stats.productsGrowth}%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Vendas por Mês
                </CardTitle>
                <CardDescription>Evolução das vendas nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="vendas" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Pedidos vs Clientes
                </CardTitle>
                <CardDescription>Comparativo de pedidos e novos clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="pedidos" fill="#10B981" />
                    <Bar dataKey="clientes" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Top 5 Produtos</CardTitle>
              <CardDescription>Produtos mais vendidos no período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R$ {product.revenue.toLocaleString()}</p>
                      <Progress value={(product.sales / topProducts[0].sales) * 100} className="w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Crescimento de Clientes</CardTitle>
                <CardDescription>Novos clientes por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clientes"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Segmentação de Clientes</CardTitle>
                <CardDescription>Distribuição por tipo de cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Clientes VIP</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">25%</span>
                    </div>
                  </div>
                  <Progress value={25} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Clientes Ativos</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">60%</span>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Clientes Inativos</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Vendas por Categoria
                </CardTitle>
                <CardDescription>Distribuição das vendas por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Performance por Categoria</CardTitle>
                <CardDescription>Detalhamento das categorias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{category.value}%</span>
                        <Progress value={category.value} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
