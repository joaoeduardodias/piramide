import type { ProductType } from "@/http/get-products";
import { formatReal } from "@/lib/validations";
import { isNewProduct } from "@/utils/count-hours-create-product";
import { ArrowRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProductProps {
  product: ProductType
  viewMode?: "grid" | "list"
}


export function Product({ product, viewMode = 'grid' }: ProductProps) {
  return (
    <Card key={product.id} className={`group hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col h-full`}>
      <CardContent className={`p-0 flex flex-col ${viewMode === 'list' ? 'md:flex-row gap-x-2' : ''} h-full`}>
        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-60 flex-shrink-0' : ''}`}>
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              width={300}
              height={300}
              className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === 'list' && 'rounded-r-md transition-none group-hover:scale-100'}`}
            />
          </Link>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNewProduct(product.createdAt) && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Novo</Badge>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mb-3">{product.categories.map(category => category.category.name).join(', ')}</p>
          <div className={`mt-auto flex flex-col justify-between ${viewMode === "list" ? "items-start" : ""}`}>
            <div className={`flex items-start gap-2  ${viewMode === 'list' && 'flex-col w-52 '}`}>
              <span className="text-xl font-bold text-gray-900">
                {formatReal(String(product.price))}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatReal(String(product.comparePrice))}
                </span>
              )}
            </div>
            <p className={`sr-only text-sm max-w-[45rem] ${viewMode === 'list' && 'not-sr-only'}`}>
              {product.description}
            </p>
            <Link
              href={`/product/${product.slug}`}
              className={`w-full mt-4`}
            >
              <Button className={`${viewMode === 'grid' && 'w-full'}`}>
                <Eye /> Ver Produto <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}