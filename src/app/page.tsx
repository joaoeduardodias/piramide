import { Header } from "@/components/header"
import { Product } from "@/components/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { products } from "@/utils/products"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {

  return (
    <main className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>


        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="text-white space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Nova Coleção 2024
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Estilo e
                  </span>
                  <span className="block bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                    Conforto
                  </span>
                  <span className="block text-2xl md:text-3xl font-normal text-gray-300 mt-2">para seus pés</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Descubra nossa coleção exclusiva de calçados premium. Onde cada passo é uma declaração de estilo.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-300">Modelos</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50k+</div>
                  <div className="text-sm text-gray-300">Clientes</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-gray-300">Avaliação</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                >
                  Explorar Coleção
                  <span className="ml-2">→</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/5 transition-all duration-300 hover:scale-105"
                >
                  Ver Ofertas
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Frete Grátis
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Troca Garantida
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Compra Segura
                </div>
              </div>
            </div>

            {/* Product Showcase */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main Product Image */}
                <div className="relative z-10 transform rotate-12 hover:rotate-6 transition-transform duration-700">
                  <div className="bg-white/10 mt-6 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <Image
                      src="/placeholder.svg?height=400&width=400&text=Premium+Sneaker+Hero"
                      alt="Calçado Premium"
                      width={400}
                      height={400}
                      className="w-full h-auto drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Floating Price Tag */}
                <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="text-sm font-medium">Até</div>
                  <div className="text-2xl font-bold">50% OFF</div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">4.9/5</div>
                      <div className="text-gray-300 text-sm">2.1k reviews</div>
                    </div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
            <span className="text-sm">Deslize para baixo</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nossas Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Tênis", "Social", "Botas", "Sandálias"].map((category) => (
              <Card key={category} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <span className="text-2xl">👟</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Produtos em Destaque</h2>
            <Link href="/products" className="text-black hover:text-gray-600 font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Product key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Fique por dentro das novidades</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Receba em primeira mão nossos lançamentos, promoções exclusivas e dicas de estilo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Seu melhor e-mail" className="bg-white text-black border-0 flex-1" />
            <Button className="bg-white text-black hover:bg-gray-100">Inscrever-se</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm">P</div>
                <span className="font-bold text-xl">Pirâmide Calçados</span>
              </div>
              <p className="text-gray-400 mb-4">Qualidade e estilo em cada passo. Sua loja de confiança desde 2020.</p>
              <div className="text-sm text-gray-400">
                <p>📍 Rua das Palmeiras, 123</p>
                <p>Centro - São Paulo, SP</p>
                <p>📞 (11) 99999-9999</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tenis" className="hover:text-white transition-colors">
                    Tênis
                  </Link>
                </li>
                <li>
                  <Link href="/social" className="hover:text-white transition-colors">
                    Social
                  </Link>
                </li>
                <li>
                  <Link href="/botas" className="hover:text-white transition-colors">
                    Botas
                  </Link>
                </li>
                <li>
                  <Link href="/sandalias" className="hover:text-white transition-colors">
                    Sandálias
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Atendimento</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/contato" className="hover:text-white transition-colors">
                    Fale Conosco
                  </Link>
                </li>
                <li>
                  <Link href="/trocas" className="hover:text-white transition-colors">
                    Trocas e Devoluções
                  </Link>
                </li>
                <li>
                  <Link href="/entrega" className="hover:text-white transition-colors">
                    Entrega
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Integração Magalu</h3>
              <p className="text-gray-400 text-sm mb-4">Nossos produtos também estão disponíveis no Magazine Luiza</p>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Ver na Magalu
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pirâmide Calçados. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
