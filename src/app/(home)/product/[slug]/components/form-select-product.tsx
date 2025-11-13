"use client"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import type { ProductDetails } from "@/http/get-product-by-slug"
import { Share2 } from "lucide-react"
import { useState } from "react"
import { ProductOptionSelector } from "./product-option-selector"

export interface FormSelectProductProps {
  product: ProductDetails
  discount: number
}

export function FormSelectProduct({ product, discount }: FormSelectProductProps) {

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)


  // const handleWhatsAppOrder = () => {
  //   const message = `Olá! Gostaria de comprar o produto:
  //     📦 *${product.name}*
  //     💰 Preço: R$ ${product.price.toFixed(2).replace(".", ",")}
  //     📏 Opções: ${selectedOptions}
  //     📊 Quantidade: ${quantity}

  //     Total: R$ ${(product.price * quantity).toFixed(2).replace(".", ",")}

  //     Poderia me ajudar com o pedido?`

  //   const whatsappUrl = `https://wa.me/5517998908771?text=${encodeURIComponent(message)}`
  //   window.open(whatsappUrl, "_blank")
  // }

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }))
  }

  const allOptionsSelected = product.options.every((option) => selectedOptions[option.id])
  return (
    <>
      {product.options.map((option) => (
        <ProductOptionSelector
          key={option.id}
          option={option}
          selectedValue={selectedOptions[option.id] || ""}
          onValueChange={handleOptionChange}
        />
      ))}
      <div>
        <h3 className="mb-2 text-gray-900">Quantidade</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              className="h-12 px-5 hover:bg-gray-100 rounded-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
            <Button
              variant="ghost"
              className="h-12 px-5 hover:bg-gray-100 rounded-none"
              onClick={() => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0)
                setQuantity(Math.min(totalStock, quantity + 1))
              }}
              disabled={quantity >= product.variants.reduce((sum, v) => sum + v.stock, 0)}
            >
              +
            </Button>
          </div>
          <span className="text-sm text-gray-600">{product.variants.reduce((sum, v) => sum + v.stock, 0)} disponíveis</span>
        </div>
      </div>
      <div className="space-y-4">
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            images: product.images,
            options: product.options,
            discount
          }}
          quantity={quantity}
          size="lg"
          className="w-full"
          disabled={!allOptionsSelected}
        />
        {/* <div className="grid grid-cols-2 gap-4"> */}
        {/* <Button
            size="lg"
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
            onClick={handleWhatsAppOrder}
            disabled={!allOptionsSelected}
          >
            <MessageCircle className="size-5 mr-2" />
            Comprar via WhatsApp
          </Button> */}
        <Button
          size="lg"
          variant="outline"
          className="border-black w-full text-black hover:bg-black hover:text-white bg-transparent"
        >
          <Share2 className="size-5 mr-2" />
          Compartilhar
        </Button>
        {/* </div> */}
      </div>


    </>
  )
}