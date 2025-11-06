import { auth, isAuthenticated } from "@/auth/auth"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Product } from "@/components/product"
import { Card, CardContent } from "@/components/ui/card"
import { getCategories } from "@/http/get-categories"
import { getProducts } from "@/http/get-products"
import Link from "next/link"

export default async function Home() {
  let isAdmin = false
  const isAuth = await isAuthenticated()
  if (isAuth) {
    const { user } = await auth()
    isAdmin = user?.role === 'ADMIN'
  }

  const { categories } = await getCategories()
  const featuredCategories = categories
    .sort((a, b) => b.products.length - a.products.length)
    .slice(0, 4)

  const { products: featuredProducts } = await getProducts({ featured: true })


  return (
    <main className="min-h-screen bg-white">
      <Header isAuthenticated={isAuth} isAdmin={isAdmin} />
      <HeroSection isAuthenticated={isAuth} />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Algumas de nossas categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <span className="text-2xl">👟</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Produtos em Destaque</h2>
            <Link href="/products" className="text-black hover:text-gray-600 font-medium">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      <Footer />

    </main >
  )
}
