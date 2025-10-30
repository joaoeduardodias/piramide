"use client";
import { getUsersByRole } from "@/http/get-customers";
import { getOrdersStats } from "@/http/get-orders-stats";
import { getProducts } from "@/http/get-products";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "./stat-card";

export function StatsDashboard() {
  const { data: ordersToday, isLoading, error } = useQuery({
    queryKey: ['ordersStatsToday'],
    queryFn: () => getOrdersStats({ date: new Date().toDateString() }),
  })
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['productsStatsToday'],
    queryFn: () => getProducts(),
  })
  const { data: customers, isLoading: loadingCustomers } = useQuery({
    queryKey: ['customersStatsToday'],
    queryFn: () => getUsersByRole({ role: "CUSTOMER" }),
  })

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar stats</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Vendas Hoje"
        value={`R$ ${ordersToday?.total}`}
        change={ordersToday?.changeTotal || ""}
        changeType={ordersToday && ordersToday.changeTotal.startsWith('+') ? "positive" : "negative"}
        bgColor={ordersToday && ordersToday.total > 1000 ? "bg-green-100" : "bg-red-100"}
        color={ordersToday && ordersToday.total > 1000 ? "text-green-800" : "text-red-800"}
        icon={DollarSign}
      />
      <StatCard
        title="Pedidos"
        value={ordersToday?.total ?? 0}
        change={ordersToday?.changeQuantity || ""}
        changeType={ordersToday && ordersToday.changeTotal.startsWith('+') ? "positive" : "negative"}
        bgColor={ordersToday && ordersToday.total > 1000 ? "bg-green-100" : "bg-red-100"}
        color={ordersToday && ordersToday.total > 1000 ? "text-green-800" : "text-red-800"}
        icon={ShoppingCart}
      />
      <StatCard
        title="Produtos"
        value={products?.products.length ?? 0}
        changeType="positive"
        color="text-purple-600"
        bgColor="bg-purple-50"
        icon={Package}
      />
      <StatCard
        title="Clientes"
        value={customers?.users.length ?? 0}
        changeType="positive"
        icon={Users}
        color="text-orange-600"
        bgColor="bg-orange-50"
      />
    </div>
  );
}
