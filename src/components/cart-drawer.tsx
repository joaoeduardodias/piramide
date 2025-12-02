"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/http/create-order"
import { formatReal } from "@/lib/validations"
import type { Role } from "@/permissions/roles"
import { useMutation } from "@tanstack/react-query"
import { CircleX, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import CFImage from "./cf-image"

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  cpf: string | null;
  phone: string | null;
}

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, isOpen, setIsOpen } = useCart()
  const pathname = usePathname()
  const [orderId, setOrderId] = useState("")
  const router = useRouter()
  const createOrderMutation = useMutation({
    mutationKey: ['create-order'],
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderId(data.orderId)
      setIsOpen(false)
      toast.success('Pedido Enviado com sucesso, Nossa equipe irá entrar em contato!')
    },
    onError: (error) => {
      console.error(error.message)
      toast.error('Erro encontrado, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })

  //   const { data: userAuth } = useQuery({
  //     queryKey: ['auth'],
  //     queryFn: () => auth(),
  //   })
  //   const [loading, setLoading] = useState(false)

  //   const handleWhatsAppCheckout = async () => {
  //     if (items.length === 0) return
  //     if (loading) return
  //     setLoading(true)

  //     if (userAuth?.user === undefined || userAuth?.user === null) {
  //       const cb = encodeURIComponent(pathname || "/")
  //       router.push(`/auth/sign-in?callbackUrl=${cb}`)
  //       return
  //     }

  //     if (userAuth?.user?.cpf === null || userAuth?.user.phone === null) {
  //       router.push("/auth/profile")
  //       return
  //     }


  //     await createOrderMutation.mutateAsync({
  //       addressId: "default-address-id",
  //       status: "PENDING",
  //       items: items.map((item) => ({
  //         productId: item.id,
  //         // variantId: item.variantId,
  //         quantity: item.quantity,
  //         unitPrice: item.price,
  //       })),
  //     })

  //     const orderDetails = items
  //       .map(
  //         (item) =>
  //           `• ${item.name}\n    Qtd: ${item.quantity}x | Preço: ${formatReal(String(item.price * item.quantity))}`,
  //       ).join("\n\n")


  //     const totalPrice = getTotalPrice()

  //     const message = `🚀 *Pedido - Pirâmide Calçados*

  // ${orderDetails}

  // 💳 *Total: ${formatReal(String(totalPrice))}*~
  // *Número do pedido: ${orderId}*

  // Gostaria de finalizar este pedido!`

  //     const whatsappUrl = `https://wa.me/5567998908771?text=${encodeURIComponent(message)}`
  //     window.open(whatsappUrl, "_blank")
  //   }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Carrinho ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="size-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h3>
              <Button onClick={() => setIsOpen(false)} className="bg-black hover:bg-gray-800 text-white">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}`}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative size-16 flex-shrink-0">
                        <CFImage
                          src={item.image || ""}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{formatReal(String(item.price))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6 bg-transparent"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-6 bg-transparent"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 px-4 space-y-4">
                <div className="space-y-2">
                  {/* {getTotalDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-600">
                        R$ {(getTotalPrice() + getTotalDiscount()).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                  {getTotalDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Desconto:</span>
                      <span className="text-green-600">-R$ {getTotalDiscount().toFixed(2).replace(".", ",")}</span>
                    </div>
                  )} */}
                  {/* <Separator /> */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatReal(String(getTotalPrice()))}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    // onClick={handleWhatsAppCheckout}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    Finalizar no WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Continuar Comprando
                  </Button>
                </div>

                <div className="text-center mb-8">
                  <p className="text-xs text-gray-500">🔒 Compra segura • 📦 Frete grátis acima de R$ 199</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
