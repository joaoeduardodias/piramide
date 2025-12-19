"use client"

import { destroyCookie, parseCookies, setCookie } from "nookies"
import { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variantId: string
  options?: { name: string; value: string }[]
}

export type AddItemPayload = Omit<CartItem, "quantity"> & { quantity?: number }

interface CartContextType {
  items: CartItem[]
  addItem: (item: AddItemPayload) => void
  removeItem: (id: string, variantId: string) => void
  updateQuantity: (id: string, variantId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_COOKIE_NAME = "piramide_cart"
const CART_COOKIE_EXPIRES = 60 * 60 * 24 * 7 // 7 days

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const cookies = parseCookies()
    const savedCart = cookies[CART_COOKIE_NAME]
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        setItems(parsedCart)
      } catch (error) {
        console.error("Error parsing cart from cookies:", error)
        destroyCookie(null, CART_COOKIE_NAME, {
          path: "/",
        })
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      if (items.length > 0) {
        setCookie(null, CART_COOKIE_NAME, JSON.stringify(items), {
          maxAge: CART_COOKIE_EXPIRES,
          sameSite: "strict",
          path: "/",
        })
      } else {
        destroyCookie(null, CART_COOKIE_NAME, {
          path: "/",
        })
      }
    }
  }, [items, isLoaded])

  const addItem = (newItem: AddItemPayload) => {
    setItems((prev) => {
      const qtyToAdd = newItem.quantity ?? 1

      const existingIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.variantId === newItem.variantId
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += qtyToAdd
        return updated
      } else {
        return [...prev, { ...newItem, quantity: qtyToAdd }]
      }
    })
  }

  const removeItem = (productId: string, variantId: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.id === productId && item.variantId === variantId)
      )
    )
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(productId, variantId)
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    setIsOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
