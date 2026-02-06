"use client"

import { useDebouncedValue } from "@/hooks/use-debounced-search"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

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

  const lastAppliedSearchRef = useRef<string | null>(null)

  const updateFilters = useCallback((next: Partial<AdminProductsFilters>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    if ("search" in next) {
      lastAppliedSearchRef.current = String(next.search ?? "")
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, 500)

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilters({ search: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch, filters.search, updateFilters])

  useEffect(() => {
    if (filters.search === lastAppliedSearchRef.current) return
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
