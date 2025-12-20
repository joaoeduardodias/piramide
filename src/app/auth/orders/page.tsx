import { Header } from "@/components/header/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOrdersByUser } from "@/http/get-orders-by-user"
import { formatReal } from "@/lib/validations"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  User,
  XCircle
} from "lucide-react"
import Link from "next/link"


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
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}


export default async function MyOrdersPage() {
  const { orders, pagination } = await getOrdersByUser()
  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto  px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">Meus Pedidos</h1>
            <p className="text-lg text-gray-300 max-w-xl">Acompanhe o status de todas as suas compras</p>
          </div>
        </div>
      </section>



      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Resumo</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total de Pedidos</span>
                  <span className="font-semibold">{pagination.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Em Andamento</span>
                  <span className="font-semibold text-blue-600">
                    {orders.filter((o) => ["PROCESSING", "CONFIRMED"].includes(o.status)).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Entregues</span>
                  <span className="font-semibold text-green-600">
                    {orders.filter((o) => o.status === "DELIVERED").length}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">Minha Conta</h3>
              <nav className="space-y-1">
                <Link
                  href="/auth/profile"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>Meu Perfil</span>
                </Link>
                <Link
                  href="/auth/orders"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-colors"
                >
                  <Package className="h-5 w-5" />
                  <span>Meus Pedidos</span>
                </Link>
                <Link
                  href="/auth/profile#enderecos"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>Endereços</span>
                </Link>

              </nav>
            </div>
            <Button asChild className="w-full" variant="outline" size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar a Loja
              </Link>
            </Button>

          </div>
        </aside>

        <main className="flex-1">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Nenhum pedido encontrado</h2>
                <p className="text-muted-foreground mb-8">
                  Você ainda não realizou nenhuma compra. Explore nossa loja e encontre os melhores produtos!
                </p>
                <Button asChild size="lg">
                  <Link href="/">Começar a Comprar</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon ?? Clock

                return (
                  <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-muted/30 border-b">
                        <div className="flex flex-wrap items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Pedido</p>
                            <p className="font-semibold">{order.number}</p>
                          </div>
                          <div className="hidden sm:block w-px h-8 bg-border" />
                          <div>
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p className="font-medium">{formatDate(String(order.createdAt))}</p>
                          </div>
                          <div className="hidden sm:block w-px h-8 bg-border" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-semibold text-primary">{formatReal(String(order.total))}</p>
                          </div>
                        </div>
                        <Badge className={`${statusConfig[order.status]?.color} gap-1.5`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig[order.status]?.label}
                        </Badge>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.product.brandName}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Object.entries(item.options).map(([key, value]) => (
                                    <Badge key={key} variant="secondary" className="text-xs">
                                      {value.name}
                                    </Badge>
                                  ))}
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Qtd: {item.quantity}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatReal(String(order.total))}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">{order.address?.name}</p>
                              <p className="text-muted-foreground">
                                {order.address?.street}, {order.address?.number}
                                {order.address?.complement && ` - ${order.address.complement}`}
                              </p>
                              <p className="text-muted-foreground">
                                {order.address?.city} - {order.address?.state}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium">Pagamento</p>
                              <p className="text-muted-foreground">{order.paymentMethod}</p>
                            </div>
                          </div>

                          {order.trackingCode && (
                            <div className="flex items-start gap-3">
                              <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium">Rastreamento</p>
                                <p className="text-muted-foreground font-mono">{order.trackingCode}</p>
                                {order.estimatedDelivery && (
                                  <p className="text-xs text-muted-foreground">
                                    Previsão: {formatDate(String(order.estimatedDelivery))}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t">
                        <div className="text-sm text-muted-foreground">
                          {pagination.total} {pagination.total === 1 ? "item" : "itens"}
                        </div>
                        {/* <Button variant="ghost" size="sm" asChild>
                            <Link href={`/pedidos/${order.id}`}>
                              Ver Detalhes
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
