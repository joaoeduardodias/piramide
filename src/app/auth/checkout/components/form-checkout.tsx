"use client"
import CFImage from "@/components/cf-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/http/create-order"
import type { Address } from "@/lib/types"
import { formatReal } from "@/lib/validations"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, CircleX, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export interface FormCheckoutProps {
  addresses: Address[]
}

export function FormCheckout({ addresses }: FormCheckoutProps) {
  const router = useRouter()
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses.filter(address => address.isDefault)[0]?.id || "")

  const { items, getTotalPrice, clearCart, setIsOpen } = useCart()
  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 199 ? 0 : 29.9
  const finalTotal = totalPrice + shipping
  if (items.length === 0) {
    router.push("/")
  }

  useEffect(() => {
    setIsOpen(false)
  }, [])

  const createOrderMutation = useMutation({
    mutationKey: ['create-order'],
    mutationFn: createOrder,
    onSuccess: (data) => {
      const { orderNumber } = data

      const orderDetails = items.map((item) => `• ${item.name}\n    Qtd: ${item.quantity}x | Preço: ${formatReal(String(item.price * item.quantity))}`).join("\n\n")
      const totalPrice = getTotalPrice()
      const message = `
    🚀 *Pedido - Pirâmide Calçados*
   ${orderDetails}

  💳 *Total: ${formatReal(String(totalPrice))}*~
  *Número do pedido: ${orderNumber}*

  Gostaria de finalizar este pedido!`

      const whatsappUrl = `https://wa.me/5517997875330?text=${encodeURIComponent(message)}`
      // const whatsappUrl = `https://wa.me/5567998908771?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    },
    onError: (error) => {
      console.error(error.message)
      toast.error('Erro encontrado, por favor tente novamente.', {
        position: 'top-right',
        icon: <CircleX />,
      })
    },
  })


  const handleFinishOrder = async () => {
    if (!selectedAddressId) {
      toast("Selecione um endereço", {
        description: "Por favor, selecione um endereço de entrega.",
      })
      return
    }

    await createOrderMutation.mutateAsync({
      addressId: selectedAddressId,
      status: "PENDING",
      items: items.map(item => {
        return {
          productId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.price,
        }
      })
    })




    clearCart()
    // router.push("/orders")
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length > 0 ? (
              <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`flex items-center  space-x-3 p-4 border-2 rounded-lg transition-colors ${selectedAddressId === address.id ? "border-black bg-gray-50" : "border-gray-200"
                      }`}
                  >
                    <RadioGroupItem value={address.id} id={address.id} />
                    <Label htmlFor={address.id} className="flex-1  cursor-pointer  items-center ">
                      <p className="font-semibold text-gray-900">{address.name}</p>
                      <p className="text-sm text-gray-600">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.district}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.district}, {address.city} - {address.state}
                      </p>
                      <p className="text-sm text-gray-600">CEP: {address.postalCode}</p>
                      {address.isDefault && (
                        <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Padrão
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Você não tem endereços cadastrados.</p>
                <Button asChild>
                  <Link href="/auth/profile?from=cart">
                    <Plus className="size-4 mr-2" />
                    Cadastrar Endereço
                  </Link>
                </Button>
              </div>
            )}

            {addresses.length > 0 && (
              <Button variant="outline" asChild size="lg" className="w-full">
                <Link href="/auth/profile?from=cart">
                  <Plus className="size-4 mr-2" />
                  Gerenciar Endereços
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>
            <Separator />
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || "default"}`} className="flex gap-3">
                  <div className="relative size-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <CFImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatReal(String(item.price * item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatReal(String(totalPrice))}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Frete</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "Grátis" : `${formatReal(String(shipping))}`}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatReal(String(finalTotal))}</span>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={handleFinishOrder}
              disabled={createOrderMutation.isPending || !selectedAddressId || addresses.length === 0}
            >
              {createOrderMutation.isPending ? "Processando..." : "Finalizar Pedido"}
            </Button>
            <Button
              size="lg"
              className="w-full"
              variant="outline"
              asChild
            >
              <Link href="/">
                Voltar a loja
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}