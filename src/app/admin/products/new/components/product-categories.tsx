"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, FolderTree, X } from "lucide-react"

interface ProductCategoryProps {
  categories: { id: string; name: string }[]
  selectedCategories: string[]
  setSelectedCategories: (value: string) => void
  errors?: Record<string, string[]> | null

}

export function ProductCategories({
  categories,
  selectedCategories,
  setSelectedCategories,
  errors,
}: ProductCategoryProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 flex items-center gap-2">
          <FolderTree className="size-5" />
          Categorias do Produto *
        </CardTitle>
        <p className="text-sm text-gray-600">Selecione uma ou mais categorias para classificar este produto</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors?.categories && (
          <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
            <AlertCircle className="size-4" />
            {errors.categories[0]}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id)
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategories(category.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all  ${isSelected
                  ? "bg-black  text-white border-black hover:bg-black"
                  : "border-gray-200 bg-white hover:bg-gray-200"
                  }`}
              >
                <Label
                  htmlFor={category.name}
                  className={`flex items-center gap-2 cursor-pointer flex-1 text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}
                >
                  <span>{category.name}</span>
                </Label>
                <Check className={`size-5 text-black ${isSelected && 'sr-only'}`} />
                {isSelected && <X className={`size-5 ${isSelected ? 'text-white' : 'text-gray-700'}`} />}
              </div>
            )
          })}

        </div>
      </CardContent>
    </Card>
  )
}
