"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { getCustomers } from "@/http/get-customers"
import { getOrdersStats } from "@/http/get-orders-stats"
import { getProducts } from "@/http/get-products"
import { formatReal } from "@/lib/validations"
import { useQuery } from "@tanstack/react-query"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { StatCard } from "./stat-card"

export function StatsDashboard() {
  const {
    data: ordersToday,
    isLoading: loadingOrders,
    error,
  } = useQuery({
    queryKey: ["ordersStatsToday"],
    queryFn: () => getOrdersStats({ date: new Date().toDateString() }),
  })

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["productsStatsToday"],
    queryFn: () => getProducts(),
  })

  const { data: customers, isLoading: loadingCustomers } = useQuery({
    queryKey: ["customersStatsToday"],
    queryFn: () => getCustomers({ limit: 9999 }),
  })

  if (error) return <div>Erro ao carregar estatísticas.</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {loadingOrders ? (
        <SkeletonStat />
      ) : (
        <StatCard
          title="Vendas Hoje"
          value={formatReal(String(ordersToday?.total ?? 0))}
          change={ordersToday?.changeTotal || ""}
          changeType={
            ordersToday && ordersToday.changeTotal.startsWith("+")
              ? "positive"
              : "negative"
          }
          bgColor={
            ordersToday && ordersToday.total > 1000
              ? "bg-green-100"
              : "bg-red-100"
          }
          color={
            ordersToday && ordersToday.total > 1000
              ? "text-green-800"
              : "text-red-800"
          }
          icon={DollarSign}
        />
      )}

      {loadingOrders ? (
        <SkeletonStat />
      ) : (
        <StatCard
          title="Pedidos"
          value={ordersToday?.quantity ?? 0}
          change={ordersToday?.changeQuantity || ""}
          changeType={
            ordersToday && ordersToday.changeTotal.startsWith("+")
              ? "positive"
              : "negative"
          }
          bgColor={
            ordersToday && ordersToday.total > 1000
              ? "bg-green-100"
              : "bg-red-100"
          }
          color={
            ordersToday && ordersToday.total > 1000
              ? "text-green-800"
              : "text-red-800"
          }
          icon={ShoppingCart}
        />
      )}

      {loadingProducts ? (
        <SkeletonStat />
      ) : (
        <StatCard
          title="Produtos"
          value={products?.pagination.total ?? 0}
          changeType="positive"
          color="text-purple-600"
          bgColor="bg-purple-50"
          icon={Package}
        />
      )}

      {loadingCustomers ? (
        <SkeletonStat />
      ) : (
        <StatCard
          title="Clientes"
          value={customers?.customers.length ?? 0}
          changeType="positive"
          icon={Users}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      )}
    </div>
  )
}

function SkeletonStat() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
