
import { auth, isAuthenticated } from "@/auth/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const stats = [
  {
    title: "Vendas Hoje",
    value: "R$ 12.450",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Pedidos",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Produtos",
    value: "1.234",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Clientes",
    value: "8.945",
    change: "-1.2%",
    changeType: "negative" as const,
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const recentOrders = [
  {
    id: "#12345",
    customer: "João Silva",
    product: "Tênis Urbano Premium",
    value: "R$ 299,90",
    status: "Pago",
    date: "Hoje, 14:30",
    statusColor: "bg-emerald-100 text-emerald-700",
    statusIcon: CheckCircle,
  },
  {
    id: "#12344",
    customer: "Maria Santos",
    product: "Sapato Social Clássico",
    value: "R$ 189,90",
    status: "Pendente",
    date: "Hoje, 13:15",
    statusColor: "bg-amber-100 text-amber-700",
    statusIcon: Clock,
  },
  {
    id: "#12343",
    customer: "Pedro Costa",
    product: "Bota Coturno Feminina",
    value: "R$ 159,90",
    status: "Enviado",
    date: "Ontem, 16:45",
    statusColor: "bg-blue-100 text-blue-700",
    statusIcon: Truck,
  },
  {
    id: "#12342",
    customer: "Ana Oliveira",
    product: "Sandália Comfort",
    value: "R$ 89,90",
    status: "Entregue",
    date: "Ontem, 10:20",
    statusColor: "bg-emerald-100 text-emerald-700",
    statusIcon: CheckCircle,
  },
]

const topProducts = [
  {
    name: "Tênis Urbano Premium",
    sales: 45,
    revenue: "R$ 13.495,50",
    image: "/placeholder.svg?height=60&width=60&text=Tênis",
    trend: "+15%",
    trendColor: "text-emerald-600",
    trendBg: "bg-emerald-100",
  },
  {
    name: "Sapato Social Clássico",
    sales: 32,
    revenue: "R$ 6.076,80",
    image: "/placeholder.svg?height=60&width=60&text=Social",
    trend: "+8%",
    trendColor: "text-emerald-600",
    trendBg: "bg-emerald-100",
  },
  {
    name: "Bota Coturno Feminina",
    sales: 28,
    revenue: "R$ 4.477,20",
    image: "/placeholder.svg?height=60&width=60&text=Bota",
    trend: "-2%",
    trendColor: "text-red-600",
    trendBg: "bg-red-100",
  },
  {
    name: "Sandália Comfort",
    sales: 24,
    revenue: "R$ 2.157,60",
    image: "/placeholder.svg?height=60&width=60&text=Sandália",
    trend: "+5%",
    trendColor: "text-emerald-600",
    trendBg: "bg-emerald-100",
  },
]

const quickActions = [
  {
    title: "Adicionar Produto",
    description: "Cadastre um novo produto",
    icon: Package,
    href: "/admin/products/new",
  },
  {
    title: "Gerenciar Pedidos",
    description: "Visualize e gerencie pedidos",
    icon: ShoppingCart,
    href: "/admin/orders",
  },
  {
    title: "Ver Relatórios",
    description: "Analise o desempenho",
    icon: TrendingUp,
    href: "/admin/reports",
  },
]

export default async function AdminDashboard() {
  if (await isAuthenticated()) {
    const { user } = await auth()
    if (user.role !== 'ADMIN') {
      redirect('/')
    }
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="size-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h2>
                <p className="text-2xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <div className="flex items-center">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="size-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="size-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ml-1 ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                      }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">em relação ao mês anterior</span>
                </div>
              </div>
              <div className={`size-12 mt-1 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* orders */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Pedidos Recentes</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Eye className="size-4 mr-2" />
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">{order.id}</span>
                      <Badge className={`text-xs flex items-center gap-1 ${order.statusColor} border-0`}>
                        <order.statusIcon className="w-3 h-3" />
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.value}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* products */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Produtos Mais Vendidos</CardTitle>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Eye className="size-4 mr-2" />
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                    {index + 1}
                  </div>
                  {/* <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="size-12 object-cover rounded-lg"
                  /> */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} vendas</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{product.revenue}</p>
                    </div>
                    <Badge className={`text-xs ${product.trendBg} ${product.trendColor} border-0`}>
                      {product.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                    <action.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
