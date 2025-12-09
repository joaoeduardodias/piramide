"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { useState, type Dispatch, type SetStateAction } from "react"


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
interface FilterSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function FilterSection({ title, defaultOpen = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border  last:border-b-0">
      <CollapsibleTrigger className="flex cursor-pointer items-center justify-between w-full py-4 hover:bg-muted/50 transition-colors px-1 rounded-sm group">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm capitalize">{title}</span>

        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">{children}</CollapsibleContent>
    </Collapsible>
  )
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
              <SlidersHorizontal className="size-5" /> Filtros
            </h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
          </div>

          <FilterSection title="Categoria" defaultOpen={true}>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar" >
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
          </FilterSection>
          <FilterSection title="Marca">
            <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar" >
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={filters.brand === brand.name}
                    onCheckedChange={() =>
                      setFilters((f) => ({
                        ...f,
                        brand: f.brand === brand.name ? "" : brand.name,
                        page: 1,
                      }))
                    }
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>


          {options.map((opt) => (
            <FilterSection key={opt.id} title={opt.name}>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
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
            </FilterSection>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

