"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface ProductPricingProps {
  price: string
  onPriceChange: (v: string) => void
  errors?: Record<string, string[]> | null
}

export function ProductPricing({
  price,
  onPriceChange,
  errors,
}: ProductPricingProps) {
  return (
    <>
      <div>
        <Label>Preço de Venda *</Label>
        <Input value={price} onChange={(e) => onPriceChange(e.target.value)} />
        <input
          type="hidden"
          name="price"
          value={price.replace(/[^\d,]/g, "").replace(",", ".")}
        />
        {errors?.price && (
          <p className="text-sm text-red-600 mt-1 flex gap-1">
            <AlertCircle size={16} />
            {errors.price[0]}
          </p>
        )}
      </div>

      <div>
        <Label>Preço Comparativo</Label>
        <Input name="comparePrice" type="number" step="0.01" />
      </div>

      <div>
        <Label>Peso (kg)</Label>
        <Input name="weight" type="number" step="0.01" />
      </div>
    </>
  )
}
