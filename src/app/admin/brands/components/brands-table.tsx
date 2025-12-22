"use client"

import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBrands } from "@/http/get-brands"
import { FolderTree, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BrandActionsClient } from "./brand-actions-client"

export function BrandsTableClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  const { data, isLoading } = useBrands({ page, limit })

  function updatePage(next: Partial<{ page: number; limit: number }>) {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`?${params.toString()}`, { scroll: false })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-10 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data || data.brands.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
        <FolderTree className="size-12 text-muted-foreground" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            Nenhuma marca encontrada
          </h3>
          <p className="text-sm text-muted-foreground">
            Comece adicionando sua primeira marca
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/admin/brands/new">
            <Plus className="mr-2 size-4" />
            Adicionar marca
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Marca</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="truncate font-medium">
                  {brand.name}
                </TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-xs whitespace-nowrap">
                    {brand.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {brand.products.length === 1
                      ? "1 produto"
                      : `${brand.products.length} produtos`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <BrandActionsClient
                    brandId={brand.id}
                    brandName={brand.name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <Pagination
          page={data.pagination.page}
          itemsPerPage={data.pagination.limit}
          totalPages={data.pagination.totalPages}
          setPage={(p) => updatePage({ page: p })}
          setItemsPerPage={(l) =>
            updatePage({ limit: l, page: 1 })
          }
        />
      </CardFooter>
    </Card>
  )
}
