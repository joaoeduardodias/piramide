"use client"
import { AddToCartButton, type SelectedOptionForCart } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import type { ProductDetails } from "@/http/get-product-by-slug"
import { useEffect, useMemo, useState } from "react"
import { ProductOptionSelector } from "./product-option-selector"
import { ShareButton } from "./share-button"

export interface FormSelectProductProps {
  product: ProductDetails
  discount: number
  title: string
  description: string
  slug: string

}

export function FormSelectProduct({ product, discount, title, description, slug }: FormSelectProductProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [optionErrors, setOptionErrors] = useState<Record<string, boolean>>({})


  useEffect(() => {
    setSelectedOptions((prev) => {
      let changed = false
      const next = { ...prev }

      product.options.forEach((option) => {
        if (option.values.length === 1 && !next[option.id]) {
          next[option.id] = option.values[0].id
          changed = true
        }
      })

      return changed ? next : prev
    })
  }, [product.options])

  useEffect(() => {
    if (!alertMessage) return
    const t = setTimeout(() => setAlertMessage(null), 3000)
    return () => clearTimeout(t)
  }, [alertMessage])

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }))
    setOptionErrors((prev) => {
      if (!prev[optionId]) return prev
      const copy = { ...prev }
      delete copy[optionId]
      return copy
    })
  }

  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedOptions).length !== product.options.length) {
      return null
    }

    return product.variants.find((variant) => {
      return product.options.every((opt) => {
        const selectedValueId = selectedOptions[opt.id]
        return variant.optionValues.some((ov) => ov.optionValueId === selectedValueId)
      })
    }) ?? null
  }, [product.variants, product.options, selectedOptions])

  const maxQuantity = selectedVariant ? selectedVariant.stock : 0
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false

  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity > 0 ? maxQuantity : 1)
    }
  }, [maxQuantity, quantity])

  const allOptionsSelected = product.options.every((opt) => Boolean(selectedOptions[opt.id]))
  const missingOptions = product.options.filter((opt) => !selectedOptions[opt.id]).map((o) => o.name)

  const formatMissingMessage = (missing: string[]) => {
    if (missing.length === 0) return null
    if (missing.length === 1) return `Selecione ${missing[0].toLowerCase()}`
    if (missing.length === 2) return `Selecione ${missing[0].toLowerCase()} e ${missing[1].toLowerCase()}`
    const last = missing.pop()
    return `Selecione ${missing.map(m => m.toLowerCase()).join(", ")} e ${last?.toLowerCase()}`
  }
  const missingMessage = formatMissingMessage([...missingOptions])

  const handleAddDisabledClick = () => {
    if (!allOptionsSelected) {

      const newErr: Record<string, boolean> = {}
      product.options.forEach((opt) => {
        if (!selectedOptions[opt.id]) newErr[opt.id] = true
      })
      setOptionErrors(newErr)
      setAlertMessage(missingMessage ?? "Selecione as opções")
      return
    }
    if (!selectedVariant || isOutOfStock) {
      setAlertMessage("Produto sem estoque")
      return
    }
  }

  const selectedOptionsForCart: SelectedOptionForCart[] = useMemo(() => {
    return product.options
      .map((opt) => {
        const selectedValueId = selectedOptions[opt.id]
        if (!selectedValueId) return null

        const valueObj = opt.values.find((v) => v.id === selectedValueId)
        if (!valueObj) return null

        return {
          name: opt.name,
          value: valueObj.value,
        }
      })
      .filter((x): x is SelectedOptionForCart => x !== null)
  }, [product.options, selectedOptions])
  return (
    <>
      {product.options.map((option) => (
        <ProductOptionSelector
          key={option.id}
          option={option}
          selectedValue={selectedOptions[option.id] || ""}
          onValueChange={handleOptionChange}
          error={Boolean(optionErrors[option.id])}
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
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
            >
              +
            </Button>
          </div>
          <span className="text-sm text-gray-600">
            {selectedVariant
              ? `${maxQuantity} disponíveis`
              : `${product.variants.reduce((s, v) => s + v.stock, 0)} disponíveis`}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              comparePrice: product.comparePrice,
              images: product.images,
              discount,
              variantId: selectedVariant?.id ?? "",
            }}
            selectedOptions={selectedOptionsForCart}
            quantity={quantity}
            size="lg"
            className="w-full"
            disabled={!allOptionsSelected || !selectedVariant || isOutOfStock}
          />
          {(!allOptionsSelected || !selectedVariant || isOutOfStock) && (
            <button
              type="button"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full"
              onClick={handleAddDisabledClick}
            />
          )}
        </div>

        <ShareButton title={title} description={description} slug={slug} />
      </div>
    </>
  )
}
