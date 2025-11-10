// "use client"

import { Product } from "@/components/product"
import { ProductType } from "@/http/get-products"

interface ProductsGridProps {
  products: ProductType[]
  viewMode: "grid" | "list"
}

export function ProductsGrid({ products, viewMode }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
      </div>
    )
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-6"
      }
    >
      {products.map((product) => (
        <Product product={product} viewMode={viewMode} key={product.id} />
      ))}
    </div>
  )
}
