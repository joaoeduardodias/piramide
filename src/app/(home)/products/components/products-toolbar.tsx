"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowUpDown,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"

export type SortBy =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "created-desc"

interface ProductsToolbarProps {
  sortBy: SortBy
  onSortChange: (value: SortBy) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  toggleFilters: () => void
}

export function ProductsToolbar({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  toggleFilters,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilters}
          className="lg:hidden"
        >
          <Filter className="size-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Ordenação (URL-driven) */}
        <Select value={sortBy} onValueChange={onSortChange}>
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

        {/* View mode (UI only) */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
