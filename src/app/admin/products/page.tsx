import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategories } from "@/http/get-categories"
import { getProducts } from "@/http/get-products"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { AlertTriangle, Package, Plus } from "lucide-react"
import Link from "next/link"
import { CardProducts } from "./components/card-products"

export const metadata = {
  title: "Produtos | Dashboard",
  description: "Gerencie os produtos",
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {


  const sp = await searchParams

  const queryParams = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    page: sp.page ? Number(sp.page) : 1,
    limit: sp.limit ? Number(sp.limit) : 10,
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["admin-products", queryParams],
    queryFn: () => getProducts(queryParams),
  })

  const { categories } = await getCategories()
  const { products, pagination } = await getProducts({ page: 1, limit: 10 })

  function countLowStockProducts(products: any[], limit: number) {
    return products.filter((p) =>
      p.variants.reduce((acc: number, v: any) => acc + v.stock, 0) < limit
    ).length
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

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold">{pagination.total}</p>
            </div>
            <Package className="size-6 text-blue-600" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
            <AlertTriangle className="size-6 text-amber-600" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Esgotados</p>
              <p className="text-2xl font-bold">{soldOutCount}</p>
            </div>
            <AlertTriangle className="size-6 text-red-600" />
          </CardContent>
        </Card>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CardProducts categories={categories} />
      </HydrationBoundary>
    </div>
  )
}
