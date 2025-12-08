"use client"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { formatReal } from "@/lib/validations"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"
import CFImage from "./cf-image"

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, isOpen, setIsOpen } = useCart()

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
                      key={`${item.id}-${item.variantId || "default"}`}
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
                        {item.options && item.options.length > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.options.map((opt) => `${opt.name}: ${opt.value}`).join(" • ")}
                          </p>
                        )}
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
                                updateQuantity(item.id, item.variantId, item.quantity - 1)
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
                                updateQuantity(item.id, item.variantId, item.quantity + 1)
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
                        onClick={() => removeItem(item.id, item.variantId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 px-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatReal(String(getTotalPrice()))}</span>
                </div>


                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <Link href="/auth/checkout" className="flex items-center justify-center w-full">
                      Finalizar Compra
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                    size="lg"
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
