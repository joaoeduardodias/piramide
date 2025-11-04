
import { auth, isAuthenticated } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategories } from "@/http/get-categories"
import { getProducts, type ProductType } from "@/http/get-products"
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { AlertTriangle, Package, Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CardProducts } from "./components/card-products"

export default async function ProductsPage() {
  if (await isAuthenticated()) {
    const { user } = await auth()
    if (user.role !== 'ADMIN') {
      redirect('/')
    }
  }

  const queryClient = new QueryClient()



  const { categories } = await getCategories()
  const { products } = await getProducts()
  await queryClient.prefetchQuery({
    queryKey: ['products', { page: 1, limit: 10 }],
    queryFn: () => getProducts({ page: 1, limit: 10 }),
  })
  function countLowStockProducts(products: ProductType[], limit = 5) {
    return products.filter((p) => {
      const totalStock = p.variants.reduce((acc: any, v: any) => acc + v.stock, 0)
      return totalStock < limit
    }).length
  }
  const lowStockCount = countLowStockProducts(products, 11)
  const soldOutCount = countLowStockProducts(products, 1)

  return (
    <div className="space-y-8">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="size-4" />
            Novo Produto
          </Button>
        </Link>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
              </div>
              <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="size-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Baixo Estoque</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{lowStockCount}</p>
              </div>
              <div className="size-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="size-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esgotados</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{soldOutCount}</p>
              </div>
              <div className="size-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="size-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <HydrationBoundary state={dehydrate(queryClient)}>

        <CardProducts categories={categories} />
      </HydrationBoundary>

    </div>
  )
}
