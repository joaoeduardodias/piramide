"use client"

import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/context/cart-context"
import { Check, ShoppingCart } from "lucide-react"
import { useState } from "react"

interface AddToCartButtonProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    images: string[]
    category: string
    discount?: number
  }
  selectedSize: string
  selectedColor: string
  quantity?: number
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
}

export function AddToCartButton({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  disabled = false,
  className = "",
  size = "default",
}: AddToCartButtonProps) {
  const { addItem, setIsOpen } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return

    const cartItem: Omit<CartItem, "quantity"> = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      selectedSize,
      selectedColor,
      discount: product.discount,
    }

    // Add multiple quantities if specified
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem)
    }

    // Show success state
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)

    // Open cart drawer after a short delay
    setTimeout(() => setIsOpen(true), 500)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || !selectedSize || !selectedColor}
      size={size}
      className={`bg-black hover:bg-gray-800 text-white transition-all duration-200 cursor-pointer z-50 ${isAdded ? "bg-green-600 hover:bg-green-700" : ""
        } ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Adicionado!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />

        </>
      )}
    </Button>
  )
}
