import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Product } from "@/components/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { products } from "@/utils/products"
import { ArrowRight, Star } from "lucide-react"
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

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="text-white space-y-8">
            <Badge className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Nova Coleção 2025
            </Badge>

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

            <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
              Descubra nossa coleção exclusiva de calçados premium. Onde cada passo é uma declaração de estilo.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-300">Modelos</p>
              </div>
              <div className="w-px h-12 bg-white/20" />

              <div className="text-center">
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-sm text-gray-300">Clientes</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.9★</p>
                <p className="text-sm text-gray-300">Avaliação</p>
              </div>
            </div>

            <Link href="/products" className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-white text-black cursor-pointer hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              >
                Explorar Coleção
                <ArrowRight className="ml-2" />
              </Button>
            </Link>

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

      {/* Categories Section */}
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

      {/* Featured Products Section */}
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


      <Footer />

    </main>
  )
}
