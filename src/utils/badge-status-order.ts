import type { OrderStatus } from "@/http/get-orders";
import { Check, CheckCircle, Clock, Package, XCircle } from "lucide-react";

export const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: Check },
  PROCESSING: { label: "Processando", color: "bg-purple-100 text-purple-800", icon: Package },
  DELIVERED: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },

}