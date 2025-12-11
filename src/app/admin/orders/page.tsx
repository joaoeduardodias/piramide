
import { Card, CardContent } from "@/components/ui/card"
import { getOrders } from "@/http/get-orders"
import { formatReal } from "@/lib/validations"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Truck
} from "lucide-react"
import { ListOrders } from "./components/list-orders"


export default async function OrdersPage() {
  const queryClient = new QueryClient()
  const { orders } = await getOrders()

  await queryClient.prefetchQuery({
    queryKey: ['orders', { page: 1, limit: 10 }],
    queryFn: () => getOrders({ page: 1, limit: 10 }),
  })



  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    canceled: orders.filter((o) => o.status === "CANCELLED").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Total</p><p className="text-2xl font-bold">{stats.total}</p></div><Package className="h-8 w-8 text-gray-400" /></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Pendentes</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div><Clock className="h-8 w-8 text-yellow-400" /></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Processando</p><p className="text-2xl font-bold text-blue-600">{stats.processing}</p></div><Package className="h-8 w-8 text-blue-400" /></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Confirmados</p><p className="text-2xl font-bold text-purple-600">{stats.confirmed}</p></div><CheckCircle className="h-8 w-8 text-purple-400" /></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Entregues</p><p className="text-2xl font-bold text-green-600">{stats.delivered}</p></div><Truck className="h-8 w-8 text-green-400" /></CardContent></Card>
        <Card><CardContent className="p-4 flex justify-between items-center"><div><p className="text-sm text-gray-600">Receita</p><p className="text-2xl font-bold text-green-600">{formatReal(String(stats.revenue))}</p></div><DollarSign className="h-8 w-8 text-green-400" /></CardContent></Card>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListOrders />
      </HydrationBoundary>

    </div>
  )
}
