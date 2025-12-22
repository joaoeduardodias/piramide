"use client"

import { useDebouncedValue } from "@/hooks/use-debounced-search"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export interface AdminProductsFilters {
  search: string
  category: string
  page: number
  limit: number
}

export type ProductStatusFilter =
  | "Todos"
  | "Baixo Estoque"
  | "Esgotado"

export function useAdminProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: AdminProductsFilters = {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "all",
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
  }

  const [status, setStatus] =
    useState<ProductStatusFilter>("Todos")

  const updateFilters = (next: Partial<AdminProductsFilters>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, 500)

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch])

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  return {
    filters,
    updateFilters,
    searchInput,
    setSearchInput,
    status,
    setStatus,
  }
}
