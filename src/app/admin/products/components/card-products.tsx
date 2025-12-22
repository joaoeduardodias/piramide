"use client"

import CFImage from "@/components/cf-image"
import { Pagination } from "@/components/pagination"
import { SortIcon, type SortDirection } from "@/components/sort-icon"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminProductsFilters, type ProductStatusFilter } from "@/hooks/use-admin-products-filters"
import { useFuseSearch } from "@/hooks/use-fuse-search"
import type { Category } from "@/http/get-categories"
import { useProducts } from "@/http/get-products"
import { formatReal } from "@/lib/validations"
import { Package2, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Props {
  categories: Category[]
}
type SortField = "name" | "price" | "stock"



function getStatusBadge(totalStock: number) {
  if (totalStock === 0) {
    return {
      label: "Esgotado",
      className: "bg-red-100 text-red-700 border-0",
    }
  }

  if (totalStock <= 5) {
    return {
      label: "Baixo Estoque",
      className: "bg-amber-100 text-amber-700 border-0",
    }
  }

  return {
    label: "Ativo",
    className: "bg-emerald-100 text-emerald-700 border-0",
  }
}


export function CardProducts({ categories }: Props) {
  const {
    filters,
    updateFilters,
    searchInput,
    setSearchInput,
    status,
    setStatus,
  } = useAdminProductsFilters()
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }


  const { data } = useProducts({
    search: filters.search || undefined,
    category: filters.category !== "all" ? filters.category : undefined,
    page: filters.page,
    limit: filters.limit,
  })

  const products = data?.products ?? []
  const totalPages = data?.pagination.totalPages ?? 0


  const { results: fuseResults } = useFuseSearch({
    data: products,
    search: searchInput,
    keys: [
      "name",
      "brand.name",
      "variants.sku",
    ],
  })

  const filteredByStatus = fuseResults.filter((product) => {
    if (status === "Todos") return true

    const totalStock = product.variants.reduce(
      (acc, v) => acc + v.stock,
      0,
    )

    if (status === "Esgotado") {
      return totalStock === 0
    }

    if (status === "Baixo Estoque") {
      return totalStock > 0 && totalStock <= 5
    }

    return true
  })


  const sortedProducts = [...filteredByStatus].sort((a, b) => {
    let aValue: string | number = ""
    let bValue: string | number = ""

    if (sortField === "name") {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    }

    if (sortField === "price") {
      aValue = Number(a.price)
      bValue = Number(b.price)
    }

    if (sortField === "stock") {
      aValue = a.variants.reduce((acc, v) => acc + v.stock, 0)
      bValue = b.variants.reduce((acc, v) => acc + v.stock, 0)
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })


  return (
    <>

      <Card className="border-0 shadow-sm">
        <CardHeader >
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>

            <div>
              <Label className="text-zinc-800 text-sm">Categoria</Label>
              <Select
                value={filters.category}
                onValueChange={(v) =>
                  updateFilters({ category: v, page: 1 })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-zinc-800 text-sm">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatusFilter)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Baixo Estoque">Baixo Estoque</SelectItem>
                  <SelectItem value="Esgotado">Esgotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm min-h-[48rem]">
        <CardHeader>
          <CardTitle>
            Lista de Produtos ({data?.pagination.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[320px] cursor-pointer select-none"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Produto</span>
                    <SortIcon
                      active={sortField === "name"}
                      direction={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">SKU</TableHead>
                <TableHead className="w-[160px]">Categoria</TableHead>
                <TableHead
                  className="w-[120px] cursor-pointer select-none"
                  onClick={() => toggleSort("price")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Preço</span>
                    <SortIcon
                      active={sortField === "price"}
                      direction={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="w-[120px] cursor-pointer select-none"
                  onClick={() => toggleSort("stock")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Estoque</span>
                    <SortIcon
                      active={sortField === "stock"}
                      direction={sortDirection}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[140px]">Marca</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-20">
                      <Package2 className="size-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Nenhum produto encontrado
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/admin/products/new">
                          <Plus className="mr-2 size-4" />
                          Novo Produto
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map((product) => {
                  const totalStock = product.variants.reduce(
                    (acc, v) => acc + v.stock,
                    0,
                  )

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          {product.images[0] && (
                            <CFImage
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="size-10 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="w-[150px] text-xs bg-gray-100 px-2 py-1 rounded truncate">
                          {product.variants[0]?.sku}
                        </code>
                      </TableCell>
                      <TableCell className="truncate">
                        {product.categories[0]?.category.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {formatReal(String(product.price))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {totalStock}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const status = getStatusBadge(totalStock)

                          return (
                            <Badge
                              className={`whitespace-nowrap ${status.className}`}
                            >
                              {status.label}
                            </Badge>
                          )
                        })()}
                      </TableCell>
                      <TableCell className="truncate">
                        {product.brand.name}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Pagination
            page={filters.page}
            itemsPerPage={filters.limit}
            setPage={(p) => updateFilters({ page: p })}
            setItemsPerPage={(l) =>
              updateFilters({ limit: l, page: 1 })
            }
            totalPages={totalPages}
          />
        </CardFooter>
      </Card>
    </>
  )
}
