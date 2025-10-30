import type { ProductType } from "@/http/get-products";
import { isNewProduct } from "@/utils/count-hours-create-product";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";



export function Product(product: ProductType) {
  return (
    <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNewProduct(product.createdAt) && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Novo</Badge>
            )}
          </div>

        </div>

        <div className="p-6">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-3">{product.categories.map(category => category.category.name)}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {Number(product.comparePrice).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
            <AddToCartButton
              product={product}
              selectedSize=""
              selectedColor="Padrão"
              size="sm"
              disabled={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}