"use client"

import { EmptyState } from "@/app/admin/components/empty-state"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/use-debounced-search"
import { useFuseSearch } from "@/hooks/use-fuse-search"
import { useInfiniteProducts, type GetProductsParams } from "@/http/get-products"
import { Loader2, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { ActiveFilters } from "./active-filters"
import { FilterSidebar } from "./filters-sidebar"
import { ProductsGrid } from "./products-grid"
import { ProductsToolbar } from "./products-toolbar"

interface Option {
  id: string
  name: string
  values: { id: string; value: string; content: string | null }[]
}

interface ProductsClientProps {
  categories: { id: string; name: string; slug: string }[]
  brands: { id: string; name: string }[]
  options: Option[]
  queryParams: GetProductsParams
}

export function ProductsClient({
  categories,
  brands,
  options,
}: ProductsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      category: searchParams.get("category") ?? "",
      brand: searchParams.get("brand") ?? "",
      sortBy: (searchParams.get("sortBy") ?? "relevance") as any,
      optionValues: searchParams.get("optionValues")?.split(",") ?? [],
      limit: Number(searchParams.get("limit") ?? 50),
    }),
    [searchParams],
  )


  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchInput, setSearchInput] = useState(filters.search)


  const debouncedSearch = useDebouncedValue(searchInput, 500)
  const shouldSearchOnServer = debouncedSearch.length >= 3


  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts(filters)

  const products = data?.pages.flatMap(p => p.products) ?? []


  const { results: fuseProducts } = useFuseSearch({
    data: products,
    search: searchInput,
    keys: [
      { name: "name", weight: 0.5 },
      { name: "brand.name", weight: 0.3 },
      { name: "categories.category.name", weight: 0.15 },
      { name: "description", weight: 0.05 },
    ],
  })

  const productsToRender =
    searchInput && !shouldSearchOnServer
      ? fuseProducts
      : products


  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])


  const updateFilters = (next: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else {
        params.set(
          key,
          Array.isArray(value) ? value.join(",") : String(value),
        )
      }
    })

    params.delete("page")
    router.push(`?${params.toString()}`, { scroll: false })
  }


  return (
    <main className="w-full">
      {/* HERO / SEARCH */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          Nossa Coleção Completa
        </h1>
        <p className="text-lg mb-3 text-center md:text-xl text-gray-300 leading-relaxed">
          Conheça nossa linha de produtos
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar produtos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-12 h-12 bg-white/10 text-white"
          />
        </div>
      </section>

      {/* CONTENT */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 mt-8">
        <FilterSidebar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
          brands={brands}
          options={options}
          filters={filters}
          onChange={updateFilters}
          clearFilters={() =>
            updateFilters({
              search: "",
              category: "",
              brand: "",
              optionValues: [],
            })
          }
        />

        <div className="flex-1">
          <ProductsToolbar
            sortBy={filters.sortBy}
            onSortChange={(value) => updateFilters({ sortBy: value })}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            toggleFilters={() => setShowFilters(v => !v)}
          />

          <ActiveFilters
            filters={filters}
            options={options}
            onChange={updateFilters}
            clearFilters={() =>
              updateFilters({
                search: "",
                category: "",
                brand: "",
                optionValues: [],
              })
            }
          />

          {isLoading && (
            <div className="w-full mt-20 flex justify-center">
              <Loader2 className="animate-spin size-14 text-zinc-600" />
            </div>
          )}

          {isError && (
            <p className="text-center py-8 text-red-500">
              Erro ao carregar produtos.
            </p>
          )}

          {!isLoading && productsToRender.length === 0 && (
            <EmptyState
              title="Nenhum produto encontrado"
              illustration="products"
            />
          )}

          <ProductsGrid
            products={productsToRender}
            viewMode={viewMode}
          />

          <div ref={ref} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && (
              <Loader2 className="animate-spin size-8 text-zinc-600" />
            )}
            {!hasNextPage && productsToRender.length > 0 && (
              <p className="text-sm text-gray-400">
                Você chegou ao fim 😉
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
