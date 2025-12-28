import { getBrands } from "@/http/get-brands"
import { getCategories } from "@/http/get-categories"
import { getOptions } from "@/http/get-options"
import { getProducts } from "@/http/get-products"
import { queryClient } from "@/lib/query-client"
import { productsSearchParams } from "@/utils/products-search"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ProductsClient } from "./components/product-client"

export default async function ProductsPage({ searchParams }:
  { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const queryParams = productsSearchParams(params)

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", queryParams],
    queryFn: ({ pageParam }) =>
      getProducts({ ...queryParams, page: pageParam }),
    initialPageParam: 1,
  })
  const [categories, brands, options] = await Promise.all([
    getCategories({ limit: 9999 }),
    getBrands({ limit: 9999 }),
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
