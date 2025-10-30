"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, isOpen, setIsOpen } =
    useCart()

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    const orderDetails = items
      .map(
        (item) =>
          `• ${item.name}\n  Tamanho: ${item.selectedSize} | Cor: ${item.selectedColor}\n  Qtd: ${item.quantity}x | Preço: R$ ${(
            item.price * item.quantity
          )
            .toFixed(2)
            .replace(".", ",")}`,
      )
      .join("\n\n")


    const totalPrice = getTotalPrice()

    const message = `🛍️ *Pedido - Pirâmide Calçados*

${orderDetails}

💳 *Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*

Gostaria de finalizar este pedido!`

    const whatsappUrl = `https://wa.me/5567998908771?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrinho ({getTotalItems()})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h3>
              <p className="text-gray-600 mb-6">Adicione alguns produtos para começar suas compras</p>
              <Button onClick={() => setIsOpen(false)} className="bg-black hover:bg-gray-800 text-white">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />

                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.selectedSize} • {item.selectedColor}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">R$ {item.price.toFixed(2).replace(".", ",")}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-6 h-6 bg-transparent"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-6 h-6 bg-transparent"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
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
                    <span>R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleWhatsAppCheckout}
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

                <div className="text-center">
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
