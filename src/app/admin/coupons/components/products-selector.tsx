"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProducts } from "@/http/get-products"
import { formatReal } from "@/lib/validations"
import { Search, X } from "lucide-react"
import { useState } from "react"



interface ProductsSelectorProps {
  selectedProductIds: string[]
  onProductsChange: (productIds: string[]) => void
}

export function ProductsSelector({ selectedProductIds, onProductsChange }: ProductsSelectorProps) {
  const [search, setSearch] = useState("")
  const { data: AVAILABLE_PRODUCTS } = useProducts({ limit: 9999 })
  if (!AVAILABLE_PRODUCTS || AVAILABLE_PRODUCTS.products.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum produto disponível</p>
  }
  const filteredProducts = AVAILABLE_PRODUCTS.products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.name.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedProducts = AVAILABLE_PRODUCTS.products.filter((p) => selectedProductIds.includes(p.id))

  const toggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      onProductsChange(selectedProductIds.filter((id) => id !== productId))
    } else {
      onProductsChange([...selectedProductIds, productId])
    }
  }

  const removeProduct = (productId: string) => {
    onProductsChange(selectedProductIds.filter((id) => id !== productId))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Produtos Selecionados ({selectedProductIds.length})</Label>
        {selectedProducts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <Badge key={product.id} variant="secondary" className="gap-1">
                {product.name}
                <button type="button" onClick={() => removeProduct(product.id)} className="ml-1 hover:text-destructive">
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum produto selecionado</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Selecionar Produtos</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="h-[300px] border rounded-lg p-2">
        <div className="space-y-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`product-${product.id}`}
                  checked={selectedProductIds.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                />
                <img
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  className="size-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.brand.name} • R$ {formatReal(String(product.price))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum produto encontrado</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
