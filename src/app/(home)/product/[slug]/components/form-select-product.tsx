"use client"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import type { ProductDetails } from "@/http/get-product-by-slug"
import { Share2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ProductOptionSelector } from "./product-option-selector"

export interface FormSelectProductProps {
  product: ProductDetails
  discount: number
}

export function FormSelectProduct({ product, discount }: FormSelectProductProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [optionErrors, setOptionErrors] = useState<Record<string, boolean>>({})

  // Limpar alertas depois de um tempo
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

  // Encontra a variante que corresponde exatamente às opções selecionadas
  const selectedVariant = useMemo(() => {
    // se não selecionou todas as opções, não há variant definida
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

  // Se a quantidade for maior que o stock da variant, ajusta
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
    if (!selectedVariant || selectedVariant.stock <= 0) {
      setAlertMessage("Produto sem estoque")
      return
    }
  }

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
              options: product.options,
              discount,
              variantId: selectedVariant?.id,
            }}
            quantity={quantity}
            size="lg"
            className="w-full"
            disabled={!allOptionsSelected || !selectedVariant || selectedVariant.stock <= 0}
          />
          {(!allOptionsSelected || !selectedVariant || selectedVariant.stock <= 0) && (
            <button
              type="button"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full"
              onClick={handleAddDisabledClick}
            />
          )}
        </div>

        <Button
          size="lg"
          variant="outline"
          className="border-black w-full text-black hover:bg-black hover:text-white bg-transparent"
        >
          <Share2 className="size-5 mr-2" />
          Compartilhar
        </Button>
      </div>
    </>
  )
}
