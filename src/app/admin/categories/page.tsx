import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCategories } from "@/http/get-categories"
import { FolderTree, Plus } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { CategoryActionsClient } from "./category-actions-client"

export const metadata = {
  title: "Categorias | Dashboard",
  description: "Gerenciar categorias de produtos",
}


export default async function CategoriesPage() {
  const { categories } = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 size-4" />
            Nova Categoria
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
        {categories.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
            <FolderTree className="size-12 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Nenhuma categoria encontrada</h3>
              <p className="text-sm text-muted-foreground">Comece criando sua primeira categoria de produtos</p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/admin/categories/new">
                <Plus className="mr-2 size-4" />
                Nova Categoria
              </Link>
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Categoria</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-2 py-1 text-xs">{category.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.products.length <= 1 ? `${category.products.length} produto` : `${category.products.length} produtos`}</Badge>
                      </TableCell>
                      <TableCell>
                        <CategoryActionsClient
                          categoryId={category.id}
                          categoryName={category.name}
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
