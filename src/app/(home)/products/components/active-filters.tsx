"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Filters {
  search: string
  category: string
  brand: string
  optionValues: string[]
  limit: number
}

interface Option {
  id: string
  name: string
  values: { id: string; value: string }[]
}

interface ActiveFiltersProps {
  filters: Filters
  options: Option[]
  onChange: (next: Partial<Filters>) => void
  clearFilters: () => void
}

export function ActiveFilters({
  filters,
  options,
  onChange,
  clearFilters,
}: ActiveFiltersProps) {
  const { category, brand, optionValues } = filters

  const activeOptionValues = options.flatMap(opt =>
    opt.values.filter(v => optionValues.includes(v.id)).map(v => ({
      optionName: opt.name,
      ...v,
    })),
  )

  const hasActiveFilters =
    Boolean(category) ||
    Boolean(brand) ||
    activeOptionValues.length > 0

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      {category && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Categoria: {category}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => onChange({ category: "" })}
          />
        </Badge>
      )}

      {brand && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Marca: {brand}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => onChange({ brand: "" })}
          />
        </Badge>
      )}

      {activeOptionValues.map(v => (
        <Badge
          key={v.id}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {v.optionName}: {v.value}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() =>
              onChange({
                optionValues: optionValues.filter(id => id !== v.id),
              })
            }
          />
        </Badge>
      ))}

      <button
        onClick={clearFilters}
        className="text-sm text-muted-foreground hover:text-foreground ml-2 underline"
      >
        Limpar tudo
      </button>
    </div>
  )
}
