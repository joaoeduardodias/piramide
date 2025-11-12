"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FiltersState {
  search: string
  category: string
  brand: string
  options: Record<string, string[]>
  page: number
  limit: number
  // se você tiver outros campos como sort/viewMode, adicionar aqui
}

interface ActiveFiltersProps {
  filters: FiltersState
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>
  clearFilters: () => void
}

export function ActiveFilters({
  filters,
  setFilters,
  clearFilters,
}: ActiveFiltersProps) {
  const { category, brand, options } = filters

  const removeOptionValue = (optionName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [optionName]: prev.options[optionName]?.filter((v) => v !== value) ?? [],
      },
    }))
  }

  // Ajuste: avaliar se há filtros ativos
  const hasActiveFilters =
    Boolean(category) ||
    (brand && brand !== "Todas") ||
    Object.values(options).some((arr) => arr.length > 0)

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {category && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Categoria: {category}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))}
          />
        </Badge>
      )}
      {brand && brand !== "Todas" && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Marca: {brand}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => setFilters((f) => ({ ...f, brand: "Todas", page: 1 }))}
          />
        </Badge>
      )}
      {Object.entries(options).map(([optName, values]) =>
        values.map((value) => (
          <Badge key={`${optName}-${value}`} variant="secondary" className="flex items-center gap-1">
            {optName}: {value}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => removeOptionValue(optName, value)}
            />
          </Badge>
        ))
      )}
      <button
        onClick={clearFilters}
        className="text-sm text-gray-500 hover:text-black ml-2 underline"
      >
        Limpar tudo
      </button>
    </div>
  )
}
