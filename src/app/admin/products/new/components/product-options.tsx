"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check } from "lucide-react"
import { generateVariantSku, getProductSkuBase } from "@/lib/sku"
import { FormCreateOptionValue } from "./form-create-option-value"

type OptionValue = {
  id: string
  value: string
  content: string | null
}
interface Variant {
  id: string
  sku: string
  price?: number
  comparePrice?: number
  stock: number
  options: Record<string, { value: string; content: string | null } | string>
  optionValueIds?: string[]
}

type SelectedOptions = Record<string, OptionValue[]>

interface ProductOptionsProps {
  defaultOptions: Record<string, OptionValue[]>
  selectedOptions: SelectedOptions
  setSelectedOptions: (v: SelectedOptions | ((prev: SelectedOptions) => SelectedOptions)) => void
  setVariants: (v: any[]) => void
  errors?: Record<string, string[]> | null
  productName: string
}

export function ProductOptions({
  defaultOptions,
  selectedOptions,
  setSelectedOptions,
  setVariants,
  errors,
  productName
}: ProductOptionsProps) {

  function generateCombinations<T>(arrays: T[][]): T[][] {
    if (!arrays.length) return []
    return arrays.reduce<T[][]>(
      (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
      [[]],
    )
  }

  function buildVariantsGeneric(
    combinations: OptionValue[][],
    optionNames: string[],
    baseSku: string,
  ): Variant[] {
    return combinations.map(combo => {
      const options: Record<string, OptionValue> = {}
      const optionValueIds: string[] = []

      combo.forEach((opt, i) => {
        options[optionNames[i]] = opt
        optionValueIds.push(opt.id) // 🔥 domínio
      })

      const sku = generateVariantSku({
        productName,
        prefix: baseSku,
        optionValues: combo.map((v) => v.value),
        optionValueIds,
      })

      return {
        id: crypto.randomUUID(),
        sku,
        stock: 0,
        options,
        optionValueIds,
      }
    })
  }





  const handleOptionToggle = (
    optionName: string,
    optionValue: OptionValue,
    productName: string,
  ) => {
    setSelectedOptions(prev => {
      const currentValues = prev[optionName] || []
      const exists = currentValues.some(v => v.id === optionValue.id)

      const updatedValues = exists
        ? currentValues.filter(v => v.id !== optionValue.id)
        : [...currentValues, optionValue]

      const newSelected = {
        ...prev,
        [optionName]: updatedValues,
      }

      const optionNames = Object.keys(newSelected)
      const optionValues = Object.values(newSelected).filter(
        arr => arr.length > 0,
      ) as OptionValue[][]

      if (!optionValues.length) {
        setVariants([])
        return newSelected
      }

      const baseSku = getProductSkuBase(productName)
      const combinations = generateCombinations(optionValues)
      const newVariants = buildVariantsGeneric(
        combinations,
        optionNames,
        baseSku,
      )

      setVariants(newVariants)

      return newSelected
    })
  }

  return (
    <div className="space-y-8">
      {Object.entries(defaultOptions).map(([optionName, values]) => {
        const selected = selectedOptions[optionName] || []
        const isColorOption = values.some((v) => v.content)

        return (
          <div key={optionName}>
            <div className=" flex items-center justify-between  mb-4">
              <Label className="capitalize">{optionName} *</Label>
              <FormCreateOptionValue optionName={optionName} />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 max-h-80 overflow-y-auto pr-1">
              {values.map((val) => {
                const isSelected = selected.some((v) => v.id === val.id)

                if (isColorOption) {
                  return (
                    <div
                      key={val.id}
                      onClick={() => handleOptionToggle(optionName, val, productName)}

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
                    onClick={() => handleOptionToggle(optionName, val, productName)}

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
