"use client"

import { Input } from "@/components/ui/input"
import { useProducts, type GetProductsParams } from "@/http/get-products"
import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ActiveFilters } from "./active-filters"
import { FilterSidebar } from "./filters-sidebar"
import { Pagination } from "./pagination"
import { ProductsGrid } from "./products-grid"
import { ProductsToolbar } from "./products-toolbar"

import { useDebounce } from "@/hooks/use-debounce"

interface Option {
  id: string
  name: string
  values: { id: string; value: string; content: string | null }[]
}

interface ProductsClientProps {
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
  options: Option[]
  queryParams: GetProductsParams
}
type FiltersState = {
  search: string
  category: string
  brand: string
  options: Record<string, string[]>
  page: number
  limit: number
}

export function ProductsClient({ categories, brands, options, queryParams }: ProductsClientProps) {

  const initialOptionsSelection = useMemo(() => {
    const map: Record<string, string[]> = {}

    if (!queryParams.optionValues || queryParams.optionValues.length === 0) {
      return map
    }

    const selectedIds = queryParams.optionValues

    for (const opt of options) {
      const selectedForOption = opt.values
        .filter((v) => selectedIds.includes(v.id))
        .map((v) => v.id)

      if (selectedForOption.length > 0) {
        map[opt.id] = selectedForOption
      }
    }

    return map
  }, [options, queryParams.optionValues])

  const [filters, setFilters] = useState({
    search: queryParams.search ?? "",
    category: queryParams.category ?? "",
    brand: queryParams.brand ?? "",
    options: initialOptionsSelection,
    page: queryParams.page ?? 1,
    limit: queryParams.limit ?? 50,
  })

  const [showFilters, setShowFilters] = useState(true)
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "created-desc">("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(filters.search || "")
  const debouncedSearch = useDebounce(searchInput, 500)

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) {
      setFilters((f: any) => ({ ...f, search: debouncedSearch, page: 1 }))
    }
  }, [debouncedSearch])

  const selectedOptionValueIds = useMemo(
    () => Object.values(filters.options).flat(),
    [filters.options],
  )


  const { data, isLoading, isError } = useProducts({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    category: filters.category,
    status: "PUBLISHED",
    sortBy: sortBy,
    brand: filters.brand,
    optionValues: selectedOptionValueIds.length ? selectedOptionValueIds : undefined,
  })
  const products = data?.products ?? []
  const pagination = data?.pagination

  const clearFilters = () =>
    setFilters({
      search: "",
      category: "",
      brand: "",
      options: {},
      page: 1,
      limit: 12,
    })

  return (
    <main className="w-full">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          Nossa Coleção Completa
        </h1>
        <p className="text-lg mb-3 text-center md:text-xl text-gray-300 leading-relaxed">
          Conheça nossa linha de produtos
        </p>
        <div className="max-w-2xl mx-auto">

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar produtos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 h-12 bg-white/10 text-white"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto flex flex-col lg:flex-row gap-8 mt-8">
        <FilterSidebar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
          brands={brands}
          options={options}
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
        />

        <div className="flex-1">
          <ProductsToolbar
            filteredCount={products.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            toggleFilters={() => setShowFilters(!showFilters)}
          />

          <ActiveFilters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

          {isLoading && <p className="text-center py-8">Carregando produtos...</p>}
          {isError && <p className="text-center py-8 text-red-500">Erro ao carregar produtos.</p>}

          {!isLoading && !isError && <ProductsGrid products={products} viewMode={viewMode} />}

          <Pagination
            currentPage={pagination?.page ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </div>
      </div>
    </main>
  )
}
