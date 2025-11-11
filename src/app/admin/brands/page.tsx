import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBrands } from "@/http/get-brands"
import { FolderTree, Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { BrandActionsClient } from "./brand-actions-client"

export const metadata = {
  title: "Marcas | Dashboard",
  description: "Gerencie as marcas de produtos",
}
export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const { brands } = await getBrands()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
          <p className="text-muted-foreground">Gerencie as marcas de produtos</p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="mr-2 size-4" />
            Adicionar Marca
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="size-10 animate-pulse rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        }
      >
        {brands.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
            <FolderTree className="size-12 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Nenhuma marca encontrada</h3>
              <p className="text-sm text-muted-foreground">Comece adicionando sua primeira marca</p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/admin/brands/new">
                <Plus className="mr-2 size-4" />
                Adicionar marca
              </Link>
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Marca</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        {brand.name}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs">{brand.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{brand.products.length <= 1 ? `${brand.products.length} produto` : `${brand.products.length} produtos`}</Badge>
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
          </Card>
        )}
      </Suspense>
    </div>
  )
}
