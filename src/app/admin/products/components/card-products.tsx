"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Category } from "@/http/get-categories"
import { useProducts, type ProductType } from "@/http/get-products"
import { formatReal } from "@/lib/validations"
import { AlertTriangle, CheckCircle, Edit, MoreHorizontal, Package2, Plus, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteProductAction } from "../actions"

interface CardProductsProps {
  // products: ProductType[]
  categories: Category[]
}

const allCategory: Category = {
  id: "all",
  name: "Todos",
  slug: "todos",
  products: []
}

export function CardProducts({ categories: categoriesDb }: CardProductsProps) {
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const { data, isLoading, isError } = useProducts({ page, limit: itemsPerPage })
  const products = data?.products ?? []
  const categories = [allCategory, ...categoriesDb]

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState("Todos")

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null)

  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 0


  const getStatusBadge = (status: string, stock: number) => {
    if (status && stock > 10) {
      return <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>
    } else if (status === "Baixo Estoque" || (stock > 0 && stock <= 5)) {
      return <Badge className="bg-amber-100 text-amber-700 border-0">Baixo Estoque</Badge>
    } else if (status === "Esgotado" || stock === 0) {
      return <Badge className="bg-red-100 text-red-700 border-0">Esgotado</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-700 border-0">Inativo</Badge>
    }
  }

  const getStockIcon = (stock: number) => {
    if (stock === 0) {
      return <AlertTriangle className="size-4 text-red-500" />
    } else if (stock <= 10) {
      return <AlertTriangle className="size-4 text-amber-500" />
    } else {
      return <CheckCircle className="size-4 text-emerald-500" />
    }
  }

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/update/${productId}`)
  }

  const handleDeleteProduct = (product: ProductType) => {
    setProductToDelete(product)
  }

  const confirmDelete = async () => {
    const data = new FormData()
    if (!productToDelete) return
    data.append("id", productToDelete.id)
    const { message, success } = await deleteProductAction(data)
    if (!success) {
      toast.error(message || "Erro ao deletar o produto")
      router.refresh()
    }
    setProductToDelete(null)
  }


  const filteredProducts = products.filter((product) => {
    const normalizedSearch = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.variants?.some((v) =>
        v.sku.toLowerCase().includes(normalizedSearch)
      )
    const matchesCategory =
      selectedCategory === "all" ||
      product.categories?.some(
        (c) => c.category?.name === selectedCategory
      )
    // const matchesStatus =
    //   selectedStatus === "Todos" || product.status === selectedStatus

    // return matchesSearch && matchesCategory && matchesStatus
    return matchesSearch && matchesCategory
  })


  const statusOptions = ["Todos", "Baixo Estoque", "Esgotado"]


  if (isLoading) return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  if (isError) return (
    <Card className="border-0 shadow-sm">
      <CardContent>
        <div className="space-y-4">
          <p>Erro encontrado!</p>
        </div>
      </CardContent>
    </Card>
  )
  if (!categories) return <p>Nenhuma categoria listada</p>

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm min-h-[48rem]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Lista de Produtos ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ?
                  <TableRow>
                    <TableCell colSpan={9} className="col-span-9">
                      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2  p-8 text-center">
                        <Package2 className="size-12 text-muted-foreground" />
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
                          <p className="text-sm text-muted-foreground">Comece criando sua primeiro produto</p>
                        </div>
                        <Button asChild className="mt-4">
                          <Link href="/admin/products/new">
                            <Plus className="mr-2 size-4" />
                            Novo Produto
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  : filteredProducts.map((product) => {
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.images.length > 0 && (
                              <Image
                                src={product.images[0].url}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="size-10 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.variants[0]?.sku}</code>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{product.categories[0]?.category.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatReal(String(product.price))}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStockIcon(product.variants.reduce((acc, variant) => acc + variant.stock, 0))}
                            <span className="text-sm">{product.variants.reduce((acc, variant) => acc + variant.stock, 0)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge('ativo', product.variants.reduce((acc, variant) => acc + variant.stock, 0))}</TableCell>
                        <TableCell>{product.brand.name}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 ">{product.sales}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                <Edit className="size-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-600" onSelect={(e) => {
                                    e.preventDefault()
                                    handleDeleteProduct(product)
                                  }}>
                                    <Trash2 className="size-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-between gap-4">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href=""
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 3 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext
                  href=""
                  onClick={(e) => {
                    e.preventDefault()
                    if (page < totalPages) setPage(page + 1)
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </>
  )
}