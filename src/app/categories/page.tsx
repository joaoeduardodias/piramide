"use client"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: "tenis",
    name: "Tênis",
    description: "Conforto e estilo para o seu dia a dia",
    image: "/placeholder.svg?height=400&width=600&text=Categoria+Tênis",
    productCount: 45,
    featured: [
      {
        id: 1,
        name: "Tênis Urbano Premium",
        price: 299.9,
        image: "/placeholder.svg?height=200&width=200&text=Tênis+1",
        rating: 4.8,
      },
      {
        id: 2,
        name: "Tênis Esportivo Pro",
        price: 349.9,
        image: "/placeholder.svg?height=200&width=200&text=Tênis+2",
        rating: 4.9,
      },
      {
        id: 3,
        name: "Tênis Casual Comfort",
        price: 249.9,
        image: "/placeholder.svg?height=200&width=200&text=Tênis+3",
        rating: 4.7,
      },
    ],
  },
  {
    id: "social",
    name: "Social",
    description: "Elegância para ocasiões especiais",
    image: "/placeholder.svg?height=400&width=600&text=Categoria+Social",
    productCount: 28,
    featured: [
      {
        id: 4,
        name: "Sapato Social Clássico",
        price: 189.9,
        image: "/placeholder.svg?height=200&width=200&text=Social+1",
        rating: 4.9,
      },
      {
        id: 5,
        name: "Oxford Premium",
        price: 259.9,
        image: "/placeholder.svg?height=200&width=200&text=Social+2",
        rating: 4.8,
      },
      {
        id: 6,
        name: "Mocassim Elegante",
        price: 219.9,
        image: "/placeholder.svg?height=200&width=200&text=Social+3",
        rating: 4.8,
      },
    ],
  },
  {
    id: "botas",
    name: "Botas",
    description: "Proteção e estilo para todas as estações",
    image: "/placeholder.svg?height=400&width=600&text=Categoria+Botas",
    productCount: 32,
    featured: [
      {
        id: 7,
        name: "Bota Coturno Feminina",
        price: 159.9,
        image: "/placeholder.svg?height=200&width=200&text=Bota+1",
        rating: 4.7,
      },
      {
        id: 8,
        name: "Bota Chelsea Masculina",
        price: 329.9,
        image: "/placeholder.svg?height=200&width=200&text=Bota+2",
        rating: 4.8,
      },
      {
        id: 9,
        name: "Bota Adventure",
        price: 279.9,
        image: "/placeholder.svg?height=200&width=200&text=Bota+3",
        rating: 4.6,
      },
    ],
  },
  {
    id: "sandalias",
    name: "Sandálias",
    description: "Leveza e conforto para os dias quentes",
    image: "/placeholder.svg?height=400&width=600&text=Categoria+Sandálias",
    productCount: 38,
    featured: [
      {
        id: 10,
        name: "Sandália Comfort",
        price: 89.9,
        image: "/placeholder.svg?height=200&width=200&text=Sandália+1",
        rating: 4.6,
      },
      {
        id: 11,
        name: "Sandália Elegante",
        price: 129.9,
        image: "/placeholder.svg?height=200&width=200&text=Sandália+2",
        rating: 4.7,
      },
      {
        id: 12,
        name: "Chinelo Premium",
        price: 69.9,
        image: "/placeholder.svg?height=200&width=200&text=Sandália+3",
        rating: 4.5,
      },
    ],
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Início
          </Link>
          <span>/</span>
          <span className="text-black">Categorias</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Nossas Categorias</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore nossa ampla seleção de calçados organizados por categoria. Encontre o par perfeito para cada
            ocasião.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
              >
                {/* Category Image */}
                <div className="lg:w-1/2">
                  <div className="relative group overflow-hidden rounded-2xl">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <Badge className="bg-white text-black hover:bg-gray-100 mb-2">
                        {category.productCount} produtos
                      </Badge>
                      <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h3>
                    <p className="text-lg text-gray-600 mb-6">{category.description}</p>
                    <Link href={`/categoria/${category.id}`}>
                      <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                        Ver todos os {category.name.toLowerCase()}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Featured Products */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Produtos em Destaque</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {category.featured.map((product) => (
                        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <Link href={`/produto/${product.id}`}>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                            <div className="p-3">
                              <div className="flex items-center gap-1 mb-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < Math.floor(product.rating)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">{product.rating}</span>
                              </div>
                              <Link href={`/produto/${product.id}`}>
                                <h5 className="font-medium text-sm text-gray-900 mb-1 hover:text-gray-600 transition-colors line-clamp-2">
                                  {product.name}
                                </h5>
                              </Link>
                              <p className="text-sm font-bold text-gray-900">
                                R$ {product.price.toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Não encontrou o que procurava?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco! Nossa equipe está pronta para ajudar você a encontrar o calçado perfeito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produtos">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                Ver Todos os Produtos
              </Button>
            </Link>
            <Link href="/contato">
              <Button
                variant="outline"
                size="lg"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
