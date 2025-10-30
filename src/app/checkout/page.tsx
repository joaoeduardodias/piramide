"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { fetchAddressByCEP } from "@/lib/cep-service"
import { formatCEP, formatCPF, formatPhone, validateCPF } from "@/lib/validations"
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface CheckoutForm {
  name: string
  email: string
  phone: string
  cpf: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export default function CheckoutPage() {

  const { items, clearCart } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)


  const [loading, setLoading] = useState(false)
  const [loadingCEP, setLoadingCEP] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Carrinho vazio</h1>
          <p className="text-gray-600 mb-8">Adicione produtos ao carrinho antes de finalizar a compra</p>
          <Link href="/produtos">
            <Button size="lg">Ver Produtos</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    let formattedValue = value

    if (field === "cpf") {
      formattedValue = formatCPF(value)
    } else if (field === "cep") {
      formattedValue = formatCEP(value)
    } else if (field === "phone") {
      formattedValue = formatPhone(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCEPBlur = async () => {
    const cleanCEP = formData.cep.replace(/\D/g, "")
    if (cleanCEP.length !== 8) return

    setLoadingCEP(true)
    const address = await fetchAddressByCEP(cleanCEP)
    setLoadingCEP(false)

    if (address) {
      setFormData((prev) => ({
        ...prev,
        street: address.street,
        neighborhood: address.district,
        city: address.city,
        state: address.state,
      }))
      toast.success("Endereço encontrado!")
    } else {
      toast.error("CEP não encontrado")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {}

    if (!formData.name.trim()) newErrors.name = "Nome obrigatório"
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email válido obrigatório"
    }
    if (!formData.phone.replace(/\D/g, "").match(/^\d{10,11}$/)) {
      newErrors.phone = "Telefone válido obrigatório"
    }
    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }
    if (!formData.cep.replace(/\D/g, "").match(/^\d{8}$/)) {
      newErrors.cep = "CEP válido obrigatório"
    }
    if (!formData.street.trim()) newErrors.street = "Rua obrigatória"
    if (!formData.number.trim()) newErrors.number = "Número obrigatório"
    if (!formData.neighborhood.trim()) newErrors.neighborhood = "Bairro obrigatório"
    if (!formData.city.trim()) newErrors.city = "Cidade obrigatória"
    if (!formData.state.trim()) newErrors.state = "Estado obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente")
      return
    }

    setLoading(true)

    // Salvar pedido no localStorage para gerenciamento posterior
    const order = {
      id: Date.now().toString(),
      customer: formData,
      items: items,
      total: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]))

    // Redirecionar para WhatsApp será implementado na próxima tarefa
    // setTimeout(() => {
    //   setLoading(false)
    //   router.push(`/checkout/whatsapp?orderId=${order.id}`)
    // }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/carrinho" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao carrinho
      </Link>

      <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Dados Pessoais</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                    className={errors.cpf ? "border-red-500" : ""}
                  />
                  {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                </div>
              </div>
            </Card>

            {/* Endereço de Entrega */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Endereço de Entrega</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <div className="relative">
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      onBlur={handleCEPBlur}
                      placeholder="00000-000"
                      className={errors.cep ? "border-red-500" : ""}
                    />
                    {loadingCEP && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" />
                    )}
                  </div>
                  {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    className={errors.street ? "border-red-500" : ""}
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    className={errors.number ? "border-red-500" : ""}
                  />
                  {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                    className={errors.neighborhood ? "border-red-500" : ""}
                  />
                  {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
                </div>

                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    maxLength={2}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                "Continuar para Pagamento"
              )}
            </Button>
          </form>
        </div>


        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      Tam: {item.selectedSize} | Qtd: {item.quantity}
                    </p>
                    <p className="font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span className="text-green-600 font-semibold">Grátis</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
