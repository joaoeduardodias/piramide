"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"
import { useCallback } from "react"

type OptionValue = {
  id: string
  value: string
  content: string | null
}

type SelectedOptions = Record<string, OptionValue[]>

interface ProductOptionsProps {
  defaultOptions: Record<string, OptionValue[]>
  selectedOptions: SelectedOptions
  setSelectedOptions: (v: SelectedOptions | ((prev: SelectedOptions) => SelectedOptions)) => void
  setVariants: (v: any[]) => void
  errors?: Record<string, string[]> | null
}

export function ProductOptions({
  defaultOptions,
  selectedOptions,
  setSelectedOptions,
  setVariants,
  errors,
}: ProductOptionsProps) {
  const toggleOption = useCallback(
    (optionName: string, value: OptionValue) => {
      setSelectedOptions((prev: SelectedOptions): SelectedOptions => {
        const current = prev[optionName] || []
        const exists = current.some((v) => v.id === value.id)

        const updated = exists
          ? current.filter((v) => v.id !== value.id)
          : [...current, value]

        const next: SelectedOptions = { ...prev, [optionName]: updated }

        // 🔥 Geração simples de variantes (igual ao fluxo original)
        const combinations = Object.values(next).reduce<OptionValue[][]>(
          (acc, values) =>
            acc.length
              ? acc.flatMap((a) => values.map((v) => [...a, v]))
              : values.map((v) => [v]),
          []
        )

        type Variant = {
          id: string
          sku: string
          stock: number
          options: Record<string, OptionValue>
        }

        setVariants(
          combinations.map((combo): Variant => ({
            id: crypto.randomUUID(),
            sku: "",
            stock: 0,
            options: Object.fromEntries(
              combo.map((v) => [optionName, v])
            ) as Record<string, OptionValue>,
          }))
        )

        return next
      })
    },
    [setSelectedOptions, setVariants]
  )

  return (
    <div className="space-y-8">
      {Object.entries(defaultOptions).map(([optionName, values]) => {
        const selected = selectedOptions[optionName] || []
        const isColorOption = values.some((v) => v.content)

        return (
          <div key={optionName}>
            <div className="flex justify-between items-center mb-4">
              <Label className="capitalize">{optionName} *</Label>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
              {values.map((val) => {
                const isSelected = selected.some((v) => v.id === val.id)

                if (isColorOption) {
                  return (
                    <div
                      key={val.id}
                      onClick={() => toggleOption(optionName, val)}
                      className={`relative cursor-pointer p-3 rounded-lg border-2 ${isSelected ? "border-black" : "border-gray-200"
                        }`}
                    >
                      <div
                        className="size-8 rounded-full mx-auto mb-2 border"
                        style={{ backgroundColor: val.content || "#f5f5f5" }}
                      />
                      <p className="text-xs text-center">{val.value}</p>

                      {isSelected && (
                        <div className="absolute top-1 right-1 size-5 bg-black rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Button
                    key={val.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleOption(optionName, val)}
                  >
                    {val.value}
                  </Button>
                )
              })}
            </div>
          </div>
        )
      })}

      {errors?.options && (
        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
          <AlertCircle size={16} />
          {errors.options[0]}
        </p>
      )}
    </div>
  )
}
