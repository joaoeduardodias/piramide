"use client"

import { destroyCookie, parseCookies, setCookie } from "nookies"
import path from "path"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  selectedSize: string
  selectedColor: string
  quantity: number
  discount?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getTotalDiscount: () => number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_COOKIE_NAME = "piramide_cart"
const CART_COOKIE_EXPIRES = 7 // days

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from cookies on mount
  useEffect(() => {
    const cookies = parseCookies()
    const savedCart = cookies[CART_COOKIE_NAME]
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("Error parsing cart from cookies:", error)
        destroyCookie(null, CART_COOKIE_NAME)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to cookies whenever items change
  useEffect(() => {
    if (isLoaded) {
      if (items.length > 0) {
        setCookie(null, CART_COOKIE_NAME, JSON.stringify(items), {
          expires: CART_COOKIE_EXPIRES,
          sameSite: "strict",
          path: path.posix.join("/", "api", "cart")
        })
      } else {
        destroyCookie(null, CART_COOKIE_NAME)
      }
    }
  }, [items, isLoaded])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor,
      )

      if (existingItemIndex > -1) {
        // Item already exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // New item, add to cart
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: number, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color)),
    )
  }

  const updateQuantity = (id: number, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size, color)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.selectedSize === size && item.selectedColor === color ? { ...item, quantity } : item,
      ),
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

  const getTotalDiscount = () => {
    return items.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return total + (item.originalPrice - item.price) * item.quantity
      }
      return total
    }, 0)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalDiscount,
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
