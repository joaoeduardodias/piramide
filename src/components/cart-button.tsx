"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"
import { CartDrawer } from "./cart-drawer"

export function CartButton() {
  const { getTotalItems, setIsOpen } = useCart()
  const totalItems = getTotalItems()

  return (
    <CartDrawer>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-black text-white text-xs">
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
      </Button>
    </CartDrawer>
  )
}
