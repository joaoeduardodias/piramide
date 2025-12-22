import { Suspense } from "react"
import { ListOrders } from "./components/list-orders"
import { OrdersStats } from "./components/orders-stats"

export const metadata = {
  title: "Pedidos | Dashboard",
  description: "Gerencie os pedidos",
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
      </div>
      <Suspense fallback={null}>
        <OrdersStats />
      </Suspense>
      <ListOrders />
    </div>
  )
}
