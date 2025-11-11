"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"


interface FiltersState {
  search: string
  category: string
  brand: string
  options: Record<string, string[]>
  page: number
  limit: number
}

interface FilterSidebarProps {
  showFilters: boolean
  setShowFilters: Dispatch<SetStateAction<boolean>>
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
  options: {
    id: string
    name: string
    values: { id: string; value: string; content: string | null }[]
  }[]
  filters: FiltersState
  setFilters: Dispatch<SetStateAction<FiltersState>>
  clearFilters: () => void
}

export function FilterSidebar({
  showFilters,
  setShowFilters,
  categories,
  brands,
  options,
  filters,
  setFilters,
  clearFilters,
}: FilterSidebarProps) {

  const toggleOptionValue = (optionName: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = prev.options[optionName] || []
      const updated = checked
        ? Array.from(new Set([...current, value]))
        : current.filter((v) => v !== value)

      return {
        ...prev,
        options: { ...prev.options, [optionName]: updated },
      }
    })
  }

  return (
    <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
      <Card className="sticky top-24">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" /> Filtros
            </h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
          </div>

          <div>
            <h4 className="font-medium mb-3">Categoria</h4>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.category === category.name}
                  onCheckedChange={() =>
                    setFilters((f) => ({
                      ...f,
                      category: f.category === category.name ? "" : category.name,
                      page: 1,
                    }))
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-3">Marca</h4>
            <Select
              value={filters.brand}
              onValueChange={(brand) => setFilters((f) => ({ ...f, brand }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {options.map((opt) => (
            <div key={opt.id}>
              <h4 className="font-medium mb-3">{opt.name}</h4>
              {opt.values.map((v) => (
                <label key={v.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.options[opt.name]?.includes(v.value) || false}
                    onCheckedChange={(checked) =>
                      toggleOptionValue(opt.name, v.value, checked as boolean)
                    }
                  />
                  <span>{v.value}</span>
                </label>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

