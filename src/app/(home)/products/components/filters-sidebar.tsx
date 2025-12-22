"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface Filters {
  search: string
  category: string
  brand: string
  optionValues: string[]
  limit: number
}

interface FilterSidebarProps {
  showFilters: boolean
  setShowFilters: (v: boolean) => void
  categories: { id: string; name: string; slug: string }[]
  brands: { id: string; name: string }[]
  options: {
    id: string
    name: string
    values: { id: string; value: string; content: string | null }[]
  }[]
  filters: Filters
  onChange: (next: Partial<Filters>) => void
  clearFilters: () => void
}

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b last:border-b-0"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 px-1 hover:bg-muted/50 rounded-sm">
        <span className="font-semibold text-sm capitalize">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
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
  onChange,
  clearFilters,
}: FilterSidebarProps) {

  const toggleOptionValue = (value: string) => {
    const current = filters.optionValues
    const exists = current.includes(value)

    onChange({
      optionValues: exists
        ? current.filter(v => v !== value)
        : [...current, value],
    })
  }


  return (
    <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
      <Card className="sticky top-24">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="size-5" />
              Filtros
            </h3>

            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
          </div>

          {/* Categoria */}
          <FilterSection title="Categoria" defaultOpen>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              {categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.category === category.slug}
                    onCheckedChange={() =>
                      onChange({
                        category:
                          filters.category === category.slug
                            ? ""
                            : category.slug,
                      })
                    }
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Marca */}
          <FilterSection title="Marca">
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              {brands.map(brand => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.brand === brand.name}
                    onCheckedChange={() =>
                      onChange({
                        brand:
                          filters.brand === brand.name
                            ? ""
                            : brand.name,
                      })
                    }
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Opções dinâmicas */}
          {options.map(opt => (
            <FilterSection key={opt.id} title={opt.name}>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                {opt.values.map(v => (
                  <label
                    key={v.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.optionValues.includes(v.value)}
                      onCheckedChange={() => toggleOptionValue(v.value)}
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
