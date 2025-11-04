
import { auth, isAuthenticated } from "@/auth/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrders } from "@/http/get-orders"
import { getProducts } from "@/http/get-products"
import {
  CheckCircle,
  CircleX,
  Clock,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { EmptyState } from "./components/empty-state"
import { StatsDashboard } from "./components/stats-dashboard"





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
  const { products, pagination } = await getProducts()
  const topSalesProducts = products
    .map(product => {
      const stock = product.variants.reduce((acc, variant) => acc + variant.stock, 0);
      const sales = product.sales || 0;
      const percentSold = stock > 0 ? sales / stock : 0;

      return {
        id: product.id,
        name: product.name,
        img: product.images[0]?.url || "",
        sales,
        stock,
        revenue: `R$ ${sales * product.price}`,
        trend: percentSold > 0.5 ? "+15%" : "-5%",
        trendColor: percentSold > 0.5 ? "text-emerald-600" : "text-red-600",
        trendBg: percentSold > 0.5 ? "bg-emerald-100" : "bg-red-100",
        percentSold
      };
    })
    .filter(product => product.sales > 0)
    .sort((a, b) => (b.percentSold || 0) - (a.percentSold || 0))
    .slice(0, 10);

  const { orders } = await getOrders()

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(order => {
      let statusColor = "bg-yellow-100 text-yellow-700"
      let statusIcon = Clock
      if (order.status === "DELIVERED") {
        statusColor = "bg-green-100 text-green-700"
        statusIcon = CheckCircle
      } else if (order.status === "CONFIRMED") {
        statusColor = "bg-blue-100 text-blue-700"
        statusIcon = Truck
      } else if (order.status === "PENDING") {
        statusColor = "bg-yellow-100 text-yellow-700"
        statusIcon = Clock
      } else if (order.status === "CANCELLED") {
        statusColor = "bg-red-100 text-red-700"
        statusIcon = CircleX
      }

      return {
        id: order.id.slice(0, 8).toUpperCase(),
        customer: order.customer?.name,
        product: order.items.map(item => item.product.name).join(", "),
        value: `R$ ${order.total.toFixed(2)}`,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString("pt-BR"),
        statusColor,
        statusIcon,
      }
    })



  return (
    <main className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="size-4" />
              Novo Produto
            </Button>
          </Link>
        </div> */}
      </div>


      <StatsDashboard />

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
              {recentOrders.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="Nenhum pedido ainda"
                  description="Quando você receber pedidos, eles aparecerão aqui. Comece divulgando sua loja!"
                  illustration="orders"
                />
              ) : recentOrders.map((order) => (
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
              {topSalesProducts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="Nenhum produto vendeu ainda"
                  description="Divulgue à sua loja para começar a vender e acompanhar o desempenho."
                  actionHref="/admin/products/new"
                  illustration="products"
                />
              ) : topSalesProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                    {index + 1}
                  </div>
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="size-12 object-cover rounded-lg"
                  />
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
