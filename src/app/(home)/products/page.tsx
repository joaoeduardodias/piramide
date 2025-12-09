import { getBrands } from "@/http/get-brands"
import { getCategories } from "@/http/get-categories"
import { getOptions } from "@/http/get-options"
import { getProducts, type GetProductsParams } from "@/http/get-products"
import { queryClient } from "@/lib/query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ProductsClient } from "./components/product-client"



export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const queryParams: GetProductsParams = {
    featured: sp?.featured === "true" ? true : undefined,
    page: sp?.page ? Number(sp.page) : 1,
    limit: sp?.limit ? Number(sp.limit) : 50,
    status: typeof sp?.status === "string" ? (sp.status as GetProductsParams["status"]) : undefined,
    category: typeof sp?.category === "string" ? sp.category : undefined,
    search: typeof sp?.search === "string" ? sp.search : undefined,
    brand: typeof sp?.brand === "string" ? sp.brand : undefined,
    optionValues:
      typeof sp?.optionValues === "string"
        ? sp.optionValues.split(",").filter(Boolean)
        : Array.isArray(sp?.optionValues)
          ? sp.optionValues
            .flatMap((v) => v.split(","))
            .filter(Boolean)
          : undefined,
  };

  await queryClient.prefetchQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  })

  const [categories, brands, options] = await Promise.all([
    getCategories(),
    getBrands(),
    getOptions(),
  ])

  return (
    <div className="min-h-screen bg-zinc-50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="py-8">
          <ProductsClient
            categories={categories.categories}
            brands={brands.brands}
            options={options.options}
            queryParams={queryParams}
          />
        </div>
      </HydrationBoundary>
    </div>
  )
}
