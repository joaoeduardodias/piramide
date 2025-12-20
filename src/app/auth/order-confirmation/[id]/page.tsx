import { auth, isAuthenticated } from "@/auth/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/http/get-order-by-id";
import { Calendar, CheckCircle, Clock, CreditCard, MapPin, Package, ShoppingBag, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>
}


const statusConfig = {
  PENDING: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Em Preparação",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: Package,
  },
  DELIVERED: {
    label: "Entregue",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: XCircle,
  },
}
const paymentMethodLabels: Record<string, string> = {
  CREDIT: "Cartão de Crédito",
  PIX: "Pix",
  DEBIT: "Cartão de Débito",
  MONEY: "Crediário"
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = await params
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    redirect("/auth/sign-in")
  }
  const { user: profile } = await auth()

  const { order } = await getOrderById({ id })
  const StatusIcon = statusConfig[order.status]?.icon ?? Clock



  return (
    <>
      <div className="min-h-screen bg-background w-full">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">
                Olá {profile.name.split(" ")[0]}, pedido confirmado!
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mb-6">
                Seu pedido foi realizado com sucesso e está sendo processado.
              </p>
              <p className="text-lg text-gray-300 max-w-xl mb-6 mt-2">Pedido #{order.number}</p>
            </div>
          </div>
        </section>
        <div className="container  mx-auto px-4 py-8 max-w-4xl">

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <Package className="w-5 h-5" />
                  <h2 className="text-lg">Detalhes do Pedido</h2>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número do Pedido:</span>
                    <span className="font-semibold text-gray-900">#{order.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${statusConfig[order.status]?.color} gap-1.5`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig[order.status]?.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-lg">Endereço de Entrega</h2>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{order.address?.name}</p>
                  <p className="text-gray-600 mt-1">
                    {order.address?.street}, {order.address?.number}
                    {order.address?.district && ` - ${order.address?.complement}`}
                  </p>
                  <p className="text-gray-600">
                    {order.address?.city} - {order.address?.state}
                  </p>
                  <p className="text-gray-600">CEP: {order.address?.postalCode}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-lg">Forma de Pagamento</h2>
                </div>
                <Separator />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{paymentMethodLabels[order.paymentMethod]}</p>
                  <p className="text-gray-600 mt-1">Pagamento será processado em breve</p>
                </div>
              </CardContent>
            </Card>
            {order.estimatedDelivery && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Calendar className="w-5 h-5" />
                    <h2 className="text-lg">Previsão de Entrega</h2>
                  </div>
                  <Separator />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" size="lg" className="flex-1 bg-transparent">
              <Link href="/auth/orders">Ver Todos os Pedidos</Link>
            </Button>
            <Button asChild size="lg" className="flex-1 bg-black hover:bg-gray-800">
              <Link href="/">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
