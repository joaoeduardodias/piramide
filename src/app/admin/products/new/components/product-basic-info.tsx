"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ProductBasicInfoProps {
  brands: { id: string; name: string }[]
  brand: string
  setBrand: (value: string) => void
  errors?: Record<string, string[]> | null
  success?: boolean
  message?: string | null
}

export function ProductBasicInfo({
  brands,
  brand,
  setBrand,
  errors,
  success,
  message,
}: ProductBasicInfoProps) {
  return (
    <>
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao Criar Produto</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          name="name"
          className={`mt-2 ${errors?.name ? "border-red-500" : ""}`}
        />
        {errors?.name && (
          <p className="text-sm text-red-600 mt-1 flex gap-1">
            <AlertCircle size={16} />
            {errors.name[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva o produto em detalhes"
          className={`mt-2 ${errors?.description ? "border-red-500" : ""}`}
          rows={4}
        />
        {errors?.description && (
          <p className="text-sm text-red-600 mt-1 flex gap-1">
            <AlertCircle size={16} />
            {errors.description[0]}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="brand">Marca</Label>
        <Select name="brandId" value={brand} onValueChange={setBrand}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione a marca" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </>
  )
}
