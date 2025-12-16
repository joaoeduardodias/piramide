"use client"
import CFImage from "@/components/cf-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/http/create-order"
import type { Address } from "@/lib/types"
import { formatReal } from "@/lib/validations"
import { useMutation } from "@tanstack/react-query"
import { AlertCircle, BadgeDollarSign, Banknote, CircleX, CreditCard, MapPin, Plus, Wallet } from "lucide-react"
import { updateTag } from "next/cache"
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
  const [paymentMethod, setPaymentMethod] = useState<string>("credit")
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
      updateTag('orders')
      const orderDetails = items.map((item) => `• ${item.name}\n    Qtd: ${item.quantity}x | Preço: ${formatReal(String(item.price * item.quantity))}`).join("\n\n")
      const totalPrice = getTotalPrice()
      const message = `
    🚀 *Pedido - Pirâmide Calçados*
   ${orderDetails}

  💳 *Total: ${formatReal(String(totalPrice))}*~
  *Número do pedido: ${orderNumber}*

  Gostaria de finalizar este pedido!`

      const whatsappUrl = `https://wa.me/55${process.env.NEXT_PUBLIC_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
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
      paymentMethod: 'PIX',
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Forma de Pagamento
            </CardTitle>
            <CardDescription>
              Pagamento Offline, Entraremos em contato pelo WhatsApp para confirmar a forma de pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "credit" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem value="credit" id="credit" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <Label htmlFor="credit" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                    <p className="text-sm text-gray-600">Em até 10x sem juros</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "debit" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem value="debit" id="debit" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <Label htmlFor="debit" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Cartão de Débito</p>
                    <p className="text-sm text-gray-600">Aprovação imediata</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "pix" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem value="pix" id="pix" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-teal-600" />
                  </div>
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">PIX</p>
                    <p className="text-sm text-gray-600">Aprovação imediata</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "boleto" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem value="boleto" id="boleto" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-orange-600" />
                  </div>
                  <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Boleto Bancário</p>
                    <p className="text-sm text-gray-600">Vencimento em 3 dias úteis</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "crediario"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem value="crediario" id="crediario" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <BadgeDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <Label htmlFor="crediario" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Crediário Pirâmide</p>
                    <p className="text-sm text-gray-600">Parcele em até 6x sem juros</p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 flex">
        <Card className="sticky top-24 h-full w-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-full">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId || "default"}`} className="flex gap-3 p-4 bg-gray-50 rounded-md">
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <CFImage src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.options.map((opt) => `${opt.name}: ${opt.value}`).join(" • ")}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatReal(String(item.price * item.quantity))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3 mt-4">
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

              <Button size="lg" className="w-full" variant="outline" asChild>
                <Link href="/">Voltar a loja</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}