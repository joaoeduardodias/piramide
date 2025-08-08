import { isNewProduct } from "@/utils/count-hours-create-product";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProductProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  rating: number;
  discount: number;
  description: string;
  features: string[];
  sizes: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  stock: number;
  sku: string;
  createdAt: string;

}


export function Product(product: ProductProps) {
  console.log(product.images[0])
  return (
    <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300 bg-white">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNewProduct(product.createdAt) && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Novo</Badge>
            )}
            {product.discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white">-{product.discount}%</Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-3">{product.category}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
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