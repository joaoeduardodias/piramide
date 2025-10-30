"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getProductBySlug } from "@/http/get-product-by-slug"
import { Heart, MessageCircle, RotateCcw, Share2, Shield, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { product } = await getProductBySlug({ slug })

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Produto não encontrado</h1>
      </main>
    )
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.options[0].name)
  const [quantity, setQuantity] = useState(1)

  const handleWhatsAppOrder = () => {
    const message = `Olá! Gostaria de comprar o produto:
    
📦 *${product.name}*
💰 Preço: R$ ${product.price.toFixed(2).replace(".", ",")}
📏 Tamanho: ${selectedSize}
🎨 Cor: ${selectedColor}
📊 Quantidade: ${quantity}

Total: R$ ${(product.price * quantity).toFixed(2).replace(".", ",")}

Poderia me ajudar com o pedido?`

    const whatsappUrl = `https://wa.me/5517998908771?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="flex items-center space-x-2 text-sm text-gray-600 container mx-auto px-4 py-4">
        <Link href="/" className="hover:text-black">
          Início
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </div>


      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
              />
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
                    src={image.url}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <p className="text-gray-600 mb-4">SKU: {product.variants.map(v => v.sku)}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    R$ {product.comparePrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {/* <div>
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
            </div> */}

            {/* Size Selection */}
            {/* <div>
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
            </div> */}

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
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.variants.reduce((max, item) => Math.max(max, item.stock), 0),
                        quantity + 1
                      )
                    )
                  }

                  disabled={quantity >= product.variants.reduce((max, item) => Math.max(max, item.stock), 0)}
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 ml-4">{product.variants.reduce((max, item) => Math.max(max, item.stock), 0)} disponíveis</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  comparePrice: product.comparePrice,
                  images: product.images,
                  // categories: product.categories
                  categories:{
                    category: {
                      id: "",
                      name: product.category[0] || "",
                      slug: ""
                    }
                  }
                  discount: product.price && product.comparePrice ? ((product.comparePrice - product.price) / product.comparePrice) * 100 : 0,
                }}
                selectedSize={selectedSize}
                selectedColor={selectedColor.name}
                quantity={quantity}
                size="lg"
                className="w-full"
              /> */}

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
      </div>

    </main >
  )
}
