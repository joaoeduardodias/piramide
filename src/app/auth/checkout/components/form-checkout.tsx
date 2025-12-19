"use client"
import CFImage from "@/components/cf-image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useFormState } from "@/hooks/use-form-state"
import type { Address } from "@/lib/types"
import { formatReal } from "@/lib/validations"
import { AlertCircle, AlertTriangle, BadgeDollarSign, CreditCard, MapPin, Plus, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createOrderAction } from "../actions"

interface FormCheckoutProps {
  addresses: Address[]
}
type PaymentMethod = "PIX" | "CREDIT" | "DEBIT" | "MONEY"

export function FormCheckout({ addresses }: FormCheckoutProps) {
  const defaultAddressId = addresses.find(a => a.isDefault)?.id

  const router = useRouter()
  const { items, getTotalPrice, clearCart, setIsOpen } = useCart()
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddressId ?? "")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()
  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 199 ? 0 : 29.9
  const finalTotal = totalPrice + shipping


  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(createOrderAction, () => {
    clearCart()
  })

  useEffect(() => {
    setIsOpen(false)
    if (items.length === 0) {
      router.push("/")
    }
  }, [])

  const formattedItemsToOrder = items.map(item => ({
    productId: item.id,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice: item.price,
  }))


  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
      <input type="hidden" name="items" value={JSON.stringify(formattedItemsToOrder)} />
      <div className="lg:col-span-2 space-y-6">
        {
          success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro encontrado</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )
        }
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5" />
              Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors?.address && (
              <p className="text-xs ml-1 text-red-600">{errors.address[0]}</p>
            )}
            {addresses.length > 0 ? (
              <RadioGroup
                name="addressId"
                value={selectedAddressId} onValueChange={setSelectedAddressId}
              >

                {addresses.map((address) => {
                  return (
                    <div
                      key={address.id}
                      className={`flex items-center  space-x-3 p-4 border-2 rounded-lg transition-colors ${selectedAddressId === address.id ? "border-black bg-gray-50" : "border-gray-200"
                        }`}
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                      />

                      <Label
                        htmlFor={address.id}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="font-semibold text-gray-900">{address.name}</p>

                        <p className="text-sm text-gray-600">
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>

                        <p className="text-sm text-gray-600">
                          {address.district}, {address.city} - {address.state}
                        </p>

                        <p className="text-sm text-gray-600">
                          CEP: {address.postalCode}
                        </p>

                        {address.isDefault && (
                          <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Padrão
                          </span>
                        )}
                      </Label>
                    </div>

                  )
                })}
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
            {errors?.paymentMethod && (
              <p className="text-xs ml-1 text-red-600">{errors.paymentMethod[0]}</p>
            )}
            <RadioGroup name="paymentMethod" value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "CREDIT" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem
                  value="CREDIT"
                  id="CREDIT"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>

                  <Label htmlFor="CREDIT" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                    <p className="text-sm text-gray-600">Em até 10x sem juros</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "DEBIT" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem
                  value="DEBIT"
                  id="DEBIT"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>

                  <Label htmlFor="DEBIT" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Cartão de Débito</p>
                    <p className="text-sm text-gray-600">Aprovação imediata</p>
                  </Label>
                </div>
              </div>
              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "PIX" ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                  }`}
              >

                <RadioGroupItem
                  value="PIX"
                  id="PIX"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-teal-600" />
                  </div>
                  <Label htmlFor="PIX" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">PIX</p>
                    <p className="text-sm text-gray-600">Aprovação imediata</p>
                  </Label>
                </div>
              </div>

              <div
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "MONEY"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <RadioGroupItem
                  value="MONEY"
                  id="MONEY"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <BadgeDollarSign className="w-5 h-5 text-green-600" />
                  </div>

                  <Label htmlFor="MONEY" className="flex-1 cursor-pointer">
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
                type="submit"
                disabled={isPending || addresses.length === 0}
              >
                {isPending ? "Processando..." : "Finalizar Pedido"}
              </Button>

              <Button size="lg" className="w-full" variant="outline" asChild>
                <Link href="/">Voltar a loja</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}