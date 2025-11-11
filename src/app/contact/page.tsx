"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const faqs = [
  {
    question: "Como faço para trocar um produto?",
    answer:
      "Você tem até 30 dias para trocar seu produto. Entre em contato conosco pelo WhatsApp ou venha até nossa loja física com a nota fiscal. O produto deve estar em perfeitas condições, sem uso e com a embalagem original.",
  },
  {
    question: "Qual o prazo de entrega?",
    answer:
      "O prazo de entrega varia de 3 a 7 dias úteis para todo o Brasil. Para São Paulo capital, oferecemos entrega expressa em até 24h. Regiões metropolitanas recebem em 2-3 dias úteis.",
  },
  {
    question: "Vocês têm loja física?",
    answer:
      "Sim! Nossa loja fica na Rua das Palmeiras, 123 - Centro, São Paulo. Funcionamos de segunda a sábado das 9h às 18h. Aos domingos estamos fechados para descanso da equipe.",
  },
  {
    question: "Como posso acompanhar meu pedido?",
    answer:
      "Após a confirmação do pagamento, você receberá um código de rastreamento por WhatsApp e email para acompanhar sua entrega em tempo real através dos Correios ou transportadora.",
  },
  {
    question: "Vocês fazem entrega em todo o Brasil?",
    answer:
      "Sim, entregamos em todo o território nacional. O frete é calculado automaticamente no checkout baseado no seu CEP. Oferecemos frete grátis para compras acima de R$ 199.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos cartão de crédito (até 12x sem juros), cartão de débito, PIX (com 5% de desconto), boleto bancário e também pagamento via WhatsApp com cartão.",
  },
]

const stats = [
  { icon: Users, label: "Clientes Atendidos", value: "50k+" },
  { icon: Award, label: "Anos de Experiência", value: "15+" },
  { icon: Shield, label: "Satisfação", value: "98%" },
]

// export const dynamic = "force-static";
// export const revalidate = 3600 // 01 hour

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form and show success
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de mais informações sobre os produtos da Pirâmide Calçados.`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600&text=Modern+Contact+Hero')] bg-cover bg-center opacity-20" />

          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
                backgroundSize: "50px 50px",
                animation: "grid-move 20s linear infinite",
              }}
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-pulse delay-2000" />

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-10 w-2 h-20 bg-gradient-to-b from-white/20 to-transparent rotate-12 animate-pulse" />
        <div className="absolute bottom-1/3 right-10 w-2 h-16 bg-gradient-to-b from-white/30 to-transparent -rotate-12 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-sm font-medium mb-8 hover:bg-white/15 transition-all duration-300 group">
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <span className="text-white">Atendimento Online 24/7</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Main Heading */}
            <div className="space-y-6 mb-8">
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-pulse">
                  Estamos
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Aqui para
                </span>
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Você
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Sua satisfação é nossa prioridade. Entre em contato conosco através dos nossos canais de atendimento ou
              <span className="text-white font-semibold"> visite nossa loja física</span> para uma experiência completa.
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={handleWhatsApp}
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
              >
                <div className="flex items-center justify-center gap-3">
                  <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                  <span>WhatsApp Direto</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-6 h-6 group-hover:animate-pulse" />
                  <span>Ligar Agora</span>
                </div>
              </button>

              <button className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-white/20">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-6 h-6 group-hover:animate-pulse" />
                  <span>Enviar E-mail</span>
                </div>
              </button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="group">
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
                    </div>

                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1px]">
                        <div className="w-full h-full rounded-3xl bg-black/50" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center gap-2 text-white/60">
                <span className="text-sm font-medium">Role para baixo</span>
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Contact Cards */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 hidden xl:block">
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">WhatsApp</div>
                  <div className="text-gray-300 text-xs">Resposta imediata</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Telefone</div>
                  <div className="text-gray-300 text-xs">(11) 99999-9999</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden xl:block">
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">E-mail</div>
                  <div className="text-gray-300 text-xs">24h para resposta</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Loja Física</div>
                  <div className="text-gray-300 text-xs">Centro, São Paulo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Envie sua Mensagem</h2>
              <p className="text-gray-600 text-lg">
                Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
              </p>
            </div>

            {isSubmitted && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-green-800">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Mensagem enviada com sucesso!</h3>
                      <p className="text-sm text-green-700">Entraremos em contato em breve.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                        Nome completo *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        className="h-12 border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                        Telefone *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="h-12 border-gray-200 focus:border-black focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className="h-12 border-gray-200 focus:border-black focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                      Assunto *
                    </label>
                    <Select value={formData.subject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className="h-12 border-gray-200 focus:border-black focus:ring-black">
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="duvida-produto">Dúvida sobre produto</SelectItem>
                        <SelectItem value="pedido">Acompanhar pedido</SelectItem>
                        <SelectItem value="troca-devolucao">Troca/Devolução</SelectItem>
                        <SelectItem value="sugestao">Sugestão</SelectItem>
                        <SelectItem value="reclamacao">Reclamação</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                      Mensagem *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Descreva sua dúvida ou solicitação..."
                      rows={6}
                      className="border-gray-200 focus:border-black focus:ring-black resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black hover:bg-gray-800 text-white h-12 flex-1 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="border-green-500 text-green-600 hover:bg-green-50 h-12 flex-1 font-semibold bg-transparent"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">Nossa Loja</h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        Rua das Palmeiras, 123
                        <br />
                        Centro - São Paulo, SP
                        <br />
                        CEP: 01234-567
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Loja Física</Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Estacionamento</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">Telefone & WhatsApp</h3>
                      <p className="text-gray-600 mb-3">
                        <a href="tel:+5511999999999" className="hover:text-black transition-colors font-medium">
                          (11) 99999-9999
                        </a>
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">WhatsApp</Badge>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">24h Online</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">E-mail</h3>
                      <p className="text-gray-600 mb-3">
                        <a
                          href="mailto:contato@piramidecalcados.com.br"
                          className="hover:text-black transition-colors font-medium"
                        >
                          contato@piramidecalcados.com.br
                        </a>
                      </p>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Resposta em até 24h</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900">Horário de Funcionamento</h3>
                      <div className="text-gray-600 space-y-1 mb-3">
                        <p className="flex justify-between">
                          <span>Segunda a Sexta:</span>
                          <span className="font-medium">9h às 18h</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Sábado:</span>
                          <span className="font-medium">9h às 16h</span>
                        </p>
                        <p className="flex justify-between">
                          <span>Domingo:</span>
                          <span className="font-medium text-red-600">Fechado</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Map */}
            <Card className="overflow-hidden shadow-xl border-0">
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=320&width=600&text=Mapa+Interativo')] bg-cover bg-center opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-700 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-black" />
                      <h3 className="font-bold text-lg mb-2">Pirâmide Calçados</h3>
                      <p className="text-sm text-gray-600 mb-3">Rua das Palmeiras, 123 - Centro, SP</p>
                      <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Ver no Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre respostas rápidas para as dúvidas mais comuns dos nossos clientes
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl ${expandedFaq === index ? "ring-2 ring-black ring-opacity-5" : ""
                  }`}
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg pr-4 text-gray-900">{faq.question}</h3>
                    <div
                      className={`transform transition-transform duration-300 flex-shrink-0 ${expandedFaq === index ? "rotate-180" : ""}`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {expandedFaq === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-black to-gray-800 text-white border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Ainda tem dúvidas?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                  Nossa equipe está sempre pronta para ajudar você a encontrar o calçado perfeito ou esclarecer qualquer
                  dúvida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button
                    onClick={handleWhatsApp}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar no WhatsApp
                  </Button>
                  <Link href="/products" className="flex-1">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-black w-full bg-transparent"
                    >
                      Ver Produtos
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
