"use client"

import { AddToCartButton } from "@/components/add-to-cart-button"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/utils/products"
import { Heart, MessageCircle, RotateCcw, Share2, Shield, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"


export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = products.find(p => p.slug === slug)
  const relatedProducts = products.filter(p => p.category === product?.category && p.slug !== slug).slice(0, 3)
  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
      </main>
    )
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)

  const handleWhatsAppOrder = () => {
    const message = `Olá! Gostaria de comprar o produto:
    
📦 *${product.name}*
💰 Preço: R$ ${product.price.toFixed(2).replace(".", ",")}
📏 Tamanho: ${selectedSize}
🎨 Cor: ${selectedColor.name}
📊 Quantidade: ${quantity}

Total: R$ ${(product.price * quantity).toFixed(2).replace(".", ",")}

Poderia me ajudar com o pedido?`

    const whatsappUrl = `https://wa.me/5517998908771?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Início
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-black">
            Produtos
          </Link>
          <span>/</span>
          <Link href="/tenis" className="hover:text-black">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-black" : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {/* <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div> */}

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <p className="text-gray-600 mb-4">SKU: {product.sku}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Cor: {selectedColor.name}</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor.name === color.name
                      ? "border-black scale-110"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Tamanho</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantidade</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 ml-4">{product.stock} disponíveis</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  images: product.images,
                  category: product.category,
                  discount: product.discount,
                }}
                selectedSize={selectedSize}
                selectedColor={selectedColor.name}
                quantity={quantity}
                size="lg"
                className="w-full"
              />

              <Button
                size="lg"
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                onClick={handleWhatsAppOrder}
                disabled={!selectedSize}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comprar via WhatsApp
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Favoritar
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Frete Grátis</p>
                  <p className="text-xs text-gray-600">Acima de R$ 199</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Troca Fácil</p>
                  <p className="text-xs text-gray-600">30 dias para trocar</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Compra Segura</p>
                  <p className="text-xs text-gray-600">Dados protegidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="specifications">Especificações</TabsTrigger>
              {/* <TabsTrigger value="reviews">Avaliações ({product.reviews})</TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <h4 className="font-semibold mb-3">Características:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Informações do Produto</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Categoria:</dt>
                      <dd className="font-medium">{product.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium">{product.sku}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tamanhos:</dt>
                      <dd className="font-medium">{product.sizes.join(", ")}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Cores:</dt>
                      <dd className="font-medium">{product.colors.map((c) => c.name).join(", ")}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Cuidados</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Limpe com pano úmido</li>
                    <li>• Não deixe de molho</li>
                    <li>• Seque à sombra</li>
                    <li>• Guarde em local arejado</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{product.rating}</div>
                  {/* <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{product.reviews} avaliações</p>
                  </div> */}
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold">Cliente {review}</span>
                        <span className="text-gray-500 text-sm">há 2 dias</span>
                      </div>
                      <p className="text-gray-700">
                        Produto excelente! Muito confortável e com ótimo acabamento. Recomendo para quem busca qualidade
                        e estilo.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link href={`/produto/${relatedProduct.id}`}>
                    <Image
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(relatedProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{relatedProduct.rating}</span>
                    </div>
                    <Link href={`/produto/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {relatedProduct.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
