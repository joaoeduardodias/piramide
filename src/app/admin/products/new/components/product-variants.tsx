"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface Variant {
  id: string
  sku: string
  price?: number
  comparePrice?: number
  stock: number
  options: Record<string, { value: string; content: string | null } | string>
}

interface ProductVariantsProps {
  variants: Variant[]
  setVariants: (v: Variant[]) => void
  errors?: Record<string, string[]> | null
}

export function ProductVariants({
  variants,
  setVariants,
  errors,
}: ProductVariantsProps) {
  const updateVariant = (
    id: string,
    field: keyof Variant,
    value: any
  ) => {
    setVariants(
      variants.map((v: Variant) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  return (
    <div className="space-y-3">
      {errors?.variants && (
        <p className="text-sm text-red-600 flex items-center gap-1 mb-2">
          <AlertCircle size={16} />
          {errors.variants[0]}
        </p>
      )}

      {variants.map((v) => (
        <div
          key={v.id}
          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border"
        >
          {/* Left */}
          <div className="flex items-center gap-3 flex-1">
            {v.options.color && (
              <div
                className="size-8 rounded-full border"
                style={{
                  backgroundColor:
                    typeof v.options.color === "string"
                      ? v.options.color
                      : v.options.color.content || "#ccc",
                }}
              />
            )}

            <div>
              <p className="font-medium">
                {Object.values(v.options)
                  .map((opt) =>
                    typeof opt === "string" ? opt : opt.value
                  )
                  .join(" - ")}
              </p>
              <p className="text-xs text-gray-500">ID: {v.id}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="w-36">
              <Label className="text-xs">SKU</Label>
              <Input
                className="h-9 mt-1"
                value={v.sku}
                onChange={(e) =>
                  updateVariant(v.id, "sku", e.target.value)
                }
              />
            </div>

            <div className="w-24">
              <Label className="text-xs">Preço</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9 mt-1"
                value={v.price ?? ""}
                onChange={(e) =>
                  updateVariant(
                    v.id,
                    "price",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="w-28">
              <Label className="text-xs">Preço Comp.</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9 mt-1"
                value={v.comparePrice ?? ""}
                onChange={(e) =>
                  updateVariant(
                    v.id,
                    "comparePrice",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="w-24">
              <Label className="text-xs">Estoque</Label>
              <Input
                type="number"
                className="h-9 mt-1"
                value={v.stock}
                onChange={(e) =>
                  updateVariant(v.id, "stock", Number(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
