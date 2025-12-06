"use client"

import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/context/cart-context"
import { Check, ShoppingBag } from "lucide-react"
import { useState } from "react"


interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number,
    comparePrice: number | null,
    discount: number,
    variantId?: string,
    images: {
      id: string;
      url: string;
      alt: string | null;
      fileKey: string | null;
      sortOrder: number;
    }[],
    options: {
      id: string;
      name: string;
      values: {
        id: string;
        value: string;
        content: string | null;
      }[];
    }[]
  }
  quantity?: number
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
}

export function AddToCartButton({
  product,
  quantity = 1,
  disabled = false,
  className = "",
  size = "default",
}: AddToCartButtonProps) {
  const { addItem, setIsOpen } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const handleAddToCart = () => {
    const cartItem: Omit<CartItem, "quantity"> = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      variantId: product.variantId,
    }


    addItem({ ...cartItem, quantity })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    setTimeout(() => setIsOpen(true), 500)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled}
      size={size}
      className="w-full h-14 text-base font-semibold bg-black hover:bg-gray-800"
    >
      {isAdded ? (
        <>
          <Check className="size-4 mr-2" />
          Adicionado!
        </>
      ) : (
        <>
          <ShoppingBag className="size-4 mr-2" /> <span className={`${size !== 'lg' && 'sr-only'}`}>Adicionar a sacola</span>
        </>
      )}
    </Button>
  )
}
