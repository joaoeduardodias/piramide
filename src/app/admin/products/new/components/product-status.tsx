"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProductStatusProps {
  featured: boolean
  setFeatured: (v: boolean) => void
}

export function ProductStatus({ featured, setFeatured }: ProductStatusProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <Label htmlFor="featured">Produto em Destaque</Label>
        <Switch checked={featured} onCheckedChange={setFeatured} />
      </div>

      <input
        type="hidden"
        name="featured"
        value={featured ? "true" : "false"}
      />

      <span className="text-xs text-muted-foreground ml-2">
        Aparece na página inicial
      </span>
    </>
  )
}
