import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Image from "next/image";
import { FormContact } from "./components/form-contact";

export const dynamic = 'force-static'


export default function ContactPage() {
  const destination = encodeURIComponent("Av. Francisco Jales, 2465,Centro - Jales, SP");
  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MessageCircle className="size-4 text-white" />
              <span className="text-sm text-white font-medium">Atendimento Personalizado</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
              Estamos Aqui para Ajudar
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Tem alguma duvida sobre nossos produtos? Nossa equipe especializada esta pronta para atender voce da
              melhor forma possível.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Send className="size-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Envie sua Mensagem</h2>
              </div>
              <p className="text-gray-600 mb-8">Preencha o formulário abaixo e retornaremos o mais breve possível.</p>

              <FormContact />
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informações de Contato</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:qualidade.piramide@hotmail.com"
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 size-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center transition-colors">
                      <Mail className="size-5 text-gray-900 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900 truncate">qualidade.piramide@hotmail.com</p>
                    </div>
                  </a>

                  <a
                    href="tel:+551736322574"
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0 size-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center transition-colors">
                      <Phone className="size-5 text-gray-900 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Telefone</p>
                      <p className="text-sm text-gray-900">(17) 3632-2574</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-lg group hover:bg-gray-50">
                    <div className="flex-shrink-0 size-10 bg-gray-100 group-hover:bg-gray-900  rounded-lg flex items-center justify-center">
                      <MapPin className="size-5 text-gray-900 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Endereço</p>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        Av Francisco Jales, 2465
                        <br />
                        Centro - Jales, SP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 group">
                    <div className="flex-shrink-0 size-10 bg-gray-100 group-hover:bg-gray-900  rounded-lg flex items-center justify-center">
                      <Clock className="size-5 text-gray-900 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Horário</p>
                      <p className="text-sm text-gray-900 leading-relaxed">
                        Seg - Sex: 8h - 18h
                        <br />
                        Sábado: 8h - 13h
                        <br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Atendimento Rápido</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  Respondemos em ate 24 horas uteis. Para urgências, ligue diretamente.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Equipe Online</span>
                </div>
              </div>

              <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <Image src="/map-location.png" alt="Localização da loja" fill className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                <Button
                  variant="secondary"
                  className="absolute bottom-4 left-4 right-4 bg-white hover:bg-gray-50"
                  asChild
                >
                  <a
                    href={`https://maps.google.com?q=${destination}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MapPin className="size-4" />
                    Ver no Mapa
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
              <p className="text-gray-600">Encontre respostas para as duvidas mais comuns</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Qual o prazo de entrega?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  O prazo de entrega varia de acordo com sua região. Em media, entregamos em ate 7 dias uteis para
                  capitais e 15 dias para demais localidades.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Posso trocar ou devolver?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sim! Voce tem ate 30 dias para trocar ou devolver seu produto, desde que esteja em perfeito estado e
                  com a embalagem original.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Como acompanho meu pedido?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Apos a confirmação do pagamento, enviaremos um código de rastreamento por email para voce acompanhar
                  sua entrega.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Aceitam cartão de credito?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sim! Aceitamos todos os principais cartões de credito e debito, além de PIX e boleto bancário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
