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
  console.log(product.variants);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [optionErrors, setOptionErrors] = useState<Record<string, boolean>>({})

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

  function variantHasOptionValue(variant: any, optionId: string, valueId: string) {
    // suportar formas comuns:
    // 1) variant.optionValues: [{ optionId, valueId }]
    if (Array.isArray(variant.optionValues)) {
      return variant.optionValues.some((ov: any) => ov.optionId === optionId && (ov.valueId === valueId || ov.value === valueId))
    }
    // 2) variant.options: { [optionId]: valueId }
    if (variant.options && typeof variant.options === "object") {
      return variant.options[optionId] === valueId || variant.options[optionId]?.id === valueId
    }
    // 3) variant.optionValueIds: ['val1', 'val2']
    if (Array.isArray(variant.optionValueIds)) {
      return variant.optionValueIds.includes(valueId)
    }
    // 4) fallback: variant.attributes contains value string
    if (Array.isArray(variant.attributes)) {
      return variant.attributes.some((a: any) => a.optionId === optionId && (a.valueId === valueId || a.value === valueId))
    }
    return false
  }

  function variantMatchesSelectedSubset(variant: any, selected: Record<string, string>) {

    return Object.entries(selected).every(([optionId, valueId]) => variantHasOptionValue(variant, optionId, valueId))
  }

  const totalStock = useMemo(() => product.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0), [product.variants])

  const filteredStock = useMemo(() => {
    const selectedCount = Object.keys(selectedOptions).length
    if (selectedCount === 0) return totalStock
    const matching = product.variants.filter((v) => variantMatchesSelectedSubset(v, selectedOptions))
    return matching.reduce((s, v) => s + (v.stock ?? 0), 0)
  }, [product.variants, selectedOptions, totalStock])



  const handleAddDisabledClick = () => {
    if (filteredStock <= 0) {
      setAlertMessage("Produto sem estoque")
      return
    }
    if (!allOptionsSelected) {
      const newErrors: Record<string, boolean> = {}
      missingOptions.forEach((name) => {
        // achar optionId pelo name (presumindo nomes únicos)
        const opt = product.options.find((o) => o.name === name)
        if (opt) newErrors[opt.id] = true
      })
      // fallback: marcar todas faltantes por id diretamente
      product.options.forEach((opt) => {
        if (!selectedOptions[opt.id] && !newErrors[opt.id]) newErrors[opt.id] = true
      })
      setOptionErrors(newErrors)
      setAlertMessage(missingMessage ?? "Selecione as opções")
      // opcional: limpar erros depois de X segundos
      setTimeout(() => setOptionErrors({}), 3000)
    }
  }
  useEffect(() => {
    if (quantity > filteredStock) setQuantity(Math.max(1, filteredStock))
  }, [filteredStock, quantity])

  const allOptionsSelected = product.options.every((option) => Boolean(selectedOptions[option.id]))

  const missingOptions = product.options.filter((option) => !selectedOptions[option.id]).map((o) => o.name)

  const formatMissingMessage = (missing: string[]) => {
    if (missing.length === 0) return null
    if (missing.length === 1) return `Selecione ${missing[0].toLowerCase()}`
    if (missing.length === 2) return `Selecione ${missing[0].toLowerCase()} e ${missing[1].toLowerCase()}`
    const last = missing.pop()
    return `Selecione ${missing.map(m => m.toLowerCase()).join(", ")} e ${last?.toLowerCase()}`
  }
  const missingMessage = formatMissingMessage([...missingOptions])

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
              onClick={() => {
                setQuantity(Math.min(filteredStock, quantity + 1))
              }}
              disabled={quantity >= filteredStock}
            >
              +
            </Button>
          </div>
          <span className="text-sm text-gray-600">
            {filteredStock} disponíveis{Object.keys(selectedOptions).length > 0 ? " (para seleção atual)" : ""}
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
              discount
            }}
            quantity={quantity}
            size="lg"
            className="w-full"
            disabled={!allOptionsSelected || filteredStock <= 0}
          />

          {(!allOptionsSelected || filteredStock <= 0) && (
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
      </div >


    </>
  )
}