"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Filter, Grid3X3, List } from "lucide-react"

interface FiltersState {
  sort: string
  viewMode: "grid" | "list"
}

interface ProductsToolbarProps {
  filteredCount: number;
  sortBy: "relevance" | "price-asc" | "price-desc" | "created-desc"
  setSortBy: (value: "relevance" | "price-asc" | "price-desc" | "created-desc") => void
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  toggleFilters: () => void;
}

export function ProductsToolbar({ filteredCount, setSortBy, setViewMode, sortBy, viewMode, toggleFilters }: ProductsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={toggleFilters} className="lg:hidden">
          <Filter className="size-4 mr-2" />
          Filtros
        </Button>
        <p className="text-gray-600">
          {filteredCount} produto{filteredCount !== 1 ? "s" : ""} encontrado
          {filteredCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger className="w-48">
            <ArrowUpDown className="size-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="created-desc">Mais recentes</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
