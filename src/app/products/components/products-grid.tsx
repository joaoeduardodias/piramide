"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductType } from "@/http/get-products"
import Image from "next/image"
import Link from "next/link"

interface ProductsGridProps {
  products: ProductType[]
  viewMode: "grid" | "list"
}

export function ProductsGrid({ products, viewMode }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
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
        <Card
          key={product.id}
          className={`group hover:shadow-xl transition-all duration-300 ${viewMode === "list" ? "flex flex-row" : ""
            }`}
        >
          <CardContent className="p-0">
            <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
              <Link href={`/produto/${product.slug}`}>
                <Image
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.images[0]?.alt ?? product.name}
                  width={300}
                  height={300}
                  className={`object-cover transition-transform duration-300 group-hover:scale-105 ${viewMode === "list" ? "w-48 h-48" : "w-full h-64"
                    }`}
                />
              </Link>
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">Destaque</Badge>
              )}
            </div>

            <div className="p-6">
              <Link href={`/produto/${product.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">
                {product.brand.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
