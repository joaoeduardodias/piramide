"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Edit, MoreHorizontal, Search, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Category {
  id: string,
  name: string,
  slug: string,
  createdAt: Date,
  updatedAt: Date,
}
interface Product {
  id: string;
  name: string;
  slug: string;
  sales: number;
  featured: boolean | null;
  description: string | null;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
  categories: {
    categoryId: string;
    productId: string;
    category: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  images: {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    productId: string;
    createdAt: Date;
    optionValueId: string | null;
  }[];
  variants: {
    id: string;
    price?: number;
    sku: string;
    stock: number;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}



interface CardProductsProps {
  products: Product[]
  categories: Category[]
}

const allCategory: Category = {
  id: "all",
  name: "Todos",
  slug: "todos",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function CardProducts({ products, categories: categoriesDb }: CardProductsProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const categories = [allCategory, ...categoriesDb]
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "Ativo" && stock > 10) {
      return <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>
    } else if (status === "Baixo Estoque" || (stock > 0 && stock <= 10)) {
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

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product)
  }

  const confirmDelete = () => {
    // Aqui você implementaria a lógica de exclusão
    console.log("Excluindo produto:", productToDelete)
    setProductToDelete(null)
    // Atualizar a lista de produtos após exclusão
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
    const matchesStatus =
      selectedStatus === "Todos" || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })



  const statusOptions = ["Todos", "Ativo", "Baixo Estoque", "Esgotado", "Inativo"]

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


      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Lista de Produtos ({filteredProducts.length})
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
                  <TableHead>Vendas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="size-10 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{product.variants[0].sku}</code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.categories[0].category.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">R$ {Number(product.price).toFixed(2).replace(".", ",")}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStockIcon(product.variants.reduce((acc, variant) => acc + variant.stock, 0))}
                        <span className="text-sm">{product.variants.reduce((acc, variant) => acc + variant.stock, 0)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.variants.reduce((acc, variant) => acc + variant.stock, 0))}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.sales}</span>
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
                          {/* <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault()
                                setSelectedProduct(product)
                              }}>
                                <Eye className="size-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Produto</DialogTitle>
                                <DialogDescription>Informações completas do produto selecionado</DialogDescription>
                              </DialogHeader>
                              {selectedProduct && (
                                <div className="space-y-6">
                                  <div className="flex items-start gap-6">
                                    <Image
                                      src={selectedProduct.images[0].url}
                                      alt={selectedProduct.name}
                                      width={120}
                                      height={120}
                                      className="size-30 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 space-y-3">
                                      <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                                        <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">SKU</p>
                                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedProduct.variants[0].sku}</code>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Categoria</p>
                                          <p className="text-sm">{selectedProduct.categories[0].category.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Preço</p>
                                          <p className="text-lg font-semibold text-green-600">
                                            R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Estoque</p>
                                          <div className="flex items-center gap-2">
                                            {getStockIcon(selectedProduct.variants.reduce((acc, variant) => acc + variant.stock, 0))}
                                            <span className="text-sm">{selectedProduct.variants.reduce((acc, variant) => acc + variant.stock, 0)} unidades</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 mb-2">Tamanhos Disponíveis</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedProduct..map((size: string) => (
                                          <Badge key={size} variant="outline" className="text-xs">
                                            {size}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600 mb-2">Cores Disponíveis</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedProduct.colors.map((color: string) => (
                                          <Badge key={color} variant="outline" className="text-xs">
                                            {color}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                      <p className="text-sm font-medium text-gray-600">Status</p>
                                      {getStatusBadge(selectedProduct.status, selectedProduct.stock)}
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium text-gray-600">Vendas</p>
                                      <p className="text-lg font-semibold text-blue-600">{selectedProduct.sales}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm font-medium text-gray-600">Criado em</p>
                                      <p className="text-sm">{new Date(selectedProduct.createdAt).toLocaleDateString("pt-BR")}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  className="bg-black hover:bg-gray-800 text-white"
                                  onClick={() => {
                                    setIsViewModalOpen(false)
                                    if (selectedProduct) {
                                      handleEditProduct(selectedProduct.id)
                                    }
                                  }}
                                >
                                  <Edit className="size-4 mr-2" />
                                  Editar Produto
                                </Button>
                                <DialogClose asChild>
                                  <Button variant="outline">
                                    Fechar
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog> */}

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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}