"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, Check, Eye, ImageIcon, Package, Palette, Ruler, Save, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useState } from "react"

const categories = ["Tênis", "Sapatos Sociais", "Botas", "Sandálias", "Chinelos", "Sapatilhas", "Mocassins"]

const defaultColors = [
  { name: "Preto", value: "#000000" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Marrom", value: "#8B4513" },
  { name: "Azul", value: "#0000FF" },
  { name: "Vermelho", value: "#FF0000" },
  { name: "Verde", value: "#008000" },
  { name: "Cinza", value: "#808080" },
  { name: "Bege", value: "#F5F5DC" },
]

const defaultSizes = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]

interface Variation {
  id: string
  color: string
  size: string
  stock: number
  sku: string
  price?: number
}

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    comparePrice: "",
    cost: "",
    sku: "",
    barcode: "",
    weight: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
  })

  const [colors, setColors] = useState(defaultColors)
  const [sizes, setSizes] = useState(defaultSizes)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [variations, setVariations] = useState<Variation[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})


  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [newColorName, setNewColorName] = useState("")
  const [newColorValue, setNewColorValue] = useState("#000000")
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [newSize, setNewSize] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const generateVariationId = (color: string, size: string) => {
    return `${color}-${size}`.toLowerCase().replace(/\s+/g, "-")
  }

  const generateVariationSku = (baseSku: string, color: string, size: string) => {
    const colorCode = color.substring(0, 3).toUpperCase()
    return `${baseSku}-${colorCode}-${size}`
  }

  const updateVariations = (colors: string[], sizes: string[]) => {
    const newVariations: Variation[] = []

    colors.forEach((color) => {
      sizes.forEach((size) => {
        const id = generateVariationId(color, size)
        const existingVariation = variations.find((v) => v.id === id)

        newVariations.push({
          id,
          color,
          size,
          stock: existingVariation?.stock || 0,
          sku: existingVariation?.sku || generateVariationSku(formData.sku || "PROD", color, size),
          price: existingVariation?.price,
        })
      })
    })

    setVariations(newVariations)
  }

  const handleColorToggle = (colorName: string) => {
    const newSelectedColors = selectedColors.includes(colorName)
      ? selectedColors.filter((c) => c !== colorName)
      : [...selectedColors, colorName]

    setSelectedColors(newSelectedColors)
    updateVariations(newSelectedColors, selectedSizes)
  }

  const handleSizeToggle = (size: string) => {
    const newSelectedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]

    setSelectedSizes(newSelectedSizes)
    updateVariations(selectedColors, newSelectedSizes)
  }

  const handleVariationChange = (variationId: string, field: keyof Variation, value: string | number) => {
    setVariations((prev) =>
      prev.map((variation) => (variation.id === variationId ? { ...variation, [field]: value } : variation)),
    )
  }

  const removeVariation = (variationId: string) => {
    const variation = variations.find((v) => v.id === variationId)
    if (!variation) return

    // Remove the variation
    const newVariations = variations.filter((v) => v.id !== variationId)
    setVariations(newVariations)

    // Update selected colors and sizes
    const remainingColors = [...new Set(newVariations.map((v) => v.color))]
    const remainingSizes = [...new Set(newVariations.map((v) => v.size))]

    setSelectedColors(remainingColors)
    setSelectedSizes(remainingSizes)
  }

  const addNewColor = () => {
    if (newColorName.trim() && !colors.find((c) => c.name === newColorName.trim())) {
      const newColor = {
        name: newColorName.trim(),
        value: newColorValue,
      }
      setColors((prev) => [...prev, newColor])
      setNewColorName("")
      setNewColorValue("#000000")
      setIsColorDialogOpen(false)
    }
  }

  const addNewSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes((prev) =>
        [...prev, newSize.trim()].sort((a, b) => {
          const aNum = Number.parseInt(a)
          const bNum = Number.parseInt(b)
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum
          }
          return a.localeCompare(b)
        }),
      )
      setNewSize("")
      setIsSizeDialogOpen(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const getTotalStock = () => {
    return variations.reduce((total, variation) => total + variation.stock, 0)
  }

  const getLowStockVariations = () => {
    return variations.filter((v) => v.stock <= 5)
  }

  const getOutOfStockVariations = () => {
    return variations.filter((v) => v.stock === 0)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória"
    if (!formData.category) newErrors.category = "Categoria é obrigatória"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Preço deve ser maior que zero"
    if (!formData.sku.trim()) newErrors.sku = "SKU é obrigatório"
    if (selectedColors.length === 0) newErrors.colors = "Selecione pelo menos uma cor"
    if (selectedSizes.length === 0) newErrors.sizes = "Selecione pelo menos um tamanho"
    if (images.length === 0) newErrors.images = "Adicione pelo menos uma imagem"
    if (variations.length === 0) newErrors.variations = "Configure pelo menos uma variação"

    // Validate variation SKUs are unique
    const skus = variations.map((v) => v.sku).filter(Boolean)
    const duplicateSkus = skus.filter((sku, index) => skus.indexOf(sku) !== index)
    if (duplicateSkus.length > 0) {
      newErrors.variationSkus = "SKUs das variações devem ser únicos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const productData = {
        ...formData,
        variations,
        images,
        isActive,
        isFeatured,
        totalStock: getTotalStock(),
      }

      console.log("Saving product:", productData)
      alert(isDraft ? "Produto salvo como rascunho!" : "Produto publicado com sucesso!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
            <p className="text-gray-600 mt-1">Adicione um novo produto ao seu catálogo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Eye className="size-4" />
            Visualizar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="size-4" />
            Salvar Rascunho
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Publicar Produto
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome do Produto *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Tênis Urbano Premium"
                  className={`mt-2 ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="size-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva as características e benefícios do produto..."
                  rows={4}
                  className={`mt-2 ${errors.description ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="size-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Categoria *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className={`mt-2 ${errors.category ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="size-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="casual, confortável, urbano"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Imagens do Produto *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Produto ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="size-3" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-black text-white text-xs">Principal</Badge>
                      )}
                    </div>
                  ))}
                  <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                    <ImageIcon className="size-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Adicionar Imagem</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="size-4" />
                    {errors.images}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  A primeira imagem será usada como imagem principal. Formatos aceitos: JPG, PNG, WebP.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Variants Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Seleção de Variações *</CardTitle>
              <p className="text-sm text-gray-600">Selecione as cores e tamanhos disponíveis para este produto</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-gray-700">Cores Disponíveis *</Label>
                  <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Palette className="size-4" />
                        Nova Cor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Cor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="colorName">Nome da Cor</Label>
                          <Input
                            id="colorName"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            placeholder="Ex: Azul Marinho"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="colorValue">Cor</Label>
                          <div className="flex items-center gap-3 mt-2">
                            <input
                              type="color"
                              id="colorValue"
                              value={newColorValue}
                              onChange={(e) => setNewColorValue(e.target.value)}
                              className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                            />
                            <Input
                              value={newColorValue}
                              onChange={(e) => setNewColorValue(e.target.value)}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={addNewColor} className="bg-black hover:bg-gray-800">
                            Adicionar Cor
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {colors.map((color) => (
                    <div
                      key={color.name}
                      className={`relative cursor-pointer p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedColors.includes(color.name)
                        ? "border-black shadow-md bg-gray-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      onClick={() => handleColorToggle(color.name)}
                    >
                      <div
                        className="size-8 rounded-full mx-auto mb-2 border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: color.value }}
                      />
                      <p className="text-xs text-center font-medium text-gray-700">{color.name}</p>
                      {selectedColors.includes(color.name) && (
                        <div className="absolute top-1 right-1 size-5 bg-black rounded-full flex items-center justify-center">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {errors.colors && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="size-4" />
                    {errors.colors}
                  </p>
                )}
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-gray-700">Tamanhos Disponíveis *</Label>
                  <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                        <Ruler className="size-4" />
                        Novo Tamanho
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Tamanho</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sizeName">Tamanho</Label>
                          <Input
                            id="sizeName"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder="Ex: 46, XL, P"
                            className="mt-2"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsSizeDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={addNewSize} className="bg-black hover:bg-gray-800">
                            Adicionar Tamanho
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSizeToggle(size)}
                      className={`h-12 transition-all hover:scale-105 ${selectedSizes.includes(size)
                        ? "bg-black text-white shadow-md"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {errors.sizes && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="size-4" />
                    {errors.sizes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variations Stock Control */}
          {variations.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="size-5" />
                      Controle de Estoque por Variação
                      <Badge className="bg-blue-100 text-blue-800">{variations.length} variações</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure o estoque individual para cada combinação de cor e tamanho
                    </p>
                  </div>
                </div>

                {/* Stock Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Package className="size-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Estoque Total</p>
                        <p className="text-2xl font-bold text-blue-900">{getTotalStock()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900">Estoque Baixo</p>
                        <p className="text-2xl font-bold text-yellow-900">{getLowStockVariations().length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <X className="size-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Sem Estoque</p>
                        <p className="text-2xl font-bold text-red-900">{getOutOfStockVariations().length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {variations.map((variation) => {
                    const color = colors.find((c) => c.name === variation.color)
                    const isLowStock = variation.stock <= 5 && variation.stock > 0
                    const isOutOfStock = variation.stock === 0

                    return (
                      <div
                        key={variation.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${isOutOfStock
                          ? "bg-red-50 border-red-200"
                          : isLowStock
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                          }`}
                      >
                        {/* Color and Size Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="size-8 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: color?.value }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {variation.color} - Tamanho {variation.size}
                            </p>
                            <p className="text-xs text-gray-500">ID: {variation.id}</p>
                          </div>

                          {/* Stock Status Badge */}
                          {isOutOfStock && (
                            <Badge variant="destructive" className="text-xs">
                              Sem Estoque
                            </Badge>
                          )}
                          {isLowStock && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Estoque Baixo</Badge>}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* SKU Input */}
                          <div className="w-36">
                            <Label className="text-xs text-gray-600">SKU</Label>
                            <Input
                              value={variation.sku}
                              onChange={(e) => handleVariationChange(variation.id, "sku", e.target.value)}
                              placeholder="SKU"
                              className="mt-1 h-9 text-sm"
                            />
                          </div>

                          {/* Stock Input */}
                          <div className="w-24">
                            <Label className="text-xs text-gray-600">Estoque</Label>
                            <Input
                              type="number"
                              min="0"
                              value={variation.stock}
                              onChange={(e) =>
                                handleVariationChange(variation.id, "stock", Number.parseInt(e.target.value) || 0)
                              }
                              placeholder="0"
                              className={`mt-1 h-9 text-sm font-medium ${isOutOfStock
                                ? "border-red-300 text-red-700"
                                : isLowStock
                                  ? "border-yellow-300 text-yellow-700"
                                  : ""
                                }`}
                            />
                          </div>


                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariation(variation.id)}
                            className="size-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {errors.variations && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-4">
                    <AlertCircle className="size-4" />
                    {errors.variations}
                  </p>
                )}

                {errors.variationSkus && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                    <AlertCircle className="size-4" />
                    {errors.variationSkus}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Status do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="active" className="font-medium text-gray-700">
                    Produto Ativo
                  </Label>
                  <p className="text-sm text-gray-500">Produto visível na loja</p>
                </div>
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="featured" className="font-medium text-gray-700">
                    Produto em Destaque
                  </Label>
                  <p className="text-sm text-gray-500">Aparece na página inicial</p>
                </div>
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Preços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Preço de Venda *
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0,00"
                    className={`pl-10 ${errors.price ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="size-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="comparePrice" className="text-sm font-medium text-gray-700">
                  Preço Comparativo
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </span>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                    placeholder="0,00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Preço original para mostrar desconto</p>
              </div>

              <div>
                <Label htmlFor="cost" className="text-sm font-medium text-gray-700">
                  Custo do Produto
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </span>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0,00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Para cálculo de margem de lucro</p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Inventory */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sku" className="text-sm font-medium text-gray-700">
                  SKU Base *
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => {
                    handleInputChange("sku", e.target.value)

                    if (variations.length > 0) {
                      const updatedVariations = variations.map((v) => ({
                        ...v,
                        sku: generateVariationSku(e.target.value, v.color, v.size),
                      }))
                      setVariations(updatedVariations)
                    }
                  }}
                  placeholder="TENIS-001"
                  className={`mt-2 ${errors.sku ? "border-red-500 focus:border-red-500" : ""}`}
                />
                {errors.sku && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="size-4" />
                    {errors.sku}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Será usado como base para SKUs das variações</p>
              </div>

              <div>
                <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                  Código de Barras
                </Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  placeholder="1234567890123"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="0.5"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <Image
                      src={images[0] || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Sem imagem</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{formData.name || "Nome do produto"}</h3>
                <p className="text-sm text-gray-600 mb-3">{formData.category || "Categoria"}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg text-gray-900">
                    R$ {formData.price ? Number.parseFloat(formData.price).toFixed(2).replace(".", ",") : "0,00"}
                  </span>
                  {formData.comparePrice &&
                    Number.parseFloat(formData.comparePrice) > Number.parseFloat(formData.price || "0") && (
                      <span className="text-sm text-gray-500 line-through">
                        R$ {Number.parseFloat(formData.comparePrice).toFixed(2).replace(".", ",")}
                      </span>
                    )}
                </div>
                {selectedColors.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Cores:</p>
                    <div className="flex gap-1">
                      {selectedColors.slice(0, 4).map((colorName) => {
                        const color = colors.find((c) => c.name === colorName)
                        return (
                          <div
                            key={colorName}
                            className="size-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color?.value }}
                          />
                        )
                      })}
                      {selectedColors.length > 4 && (
                        <span className="text-xs text-gray-500">+{selectedColors.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
                {selectedSizes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Tamanhos:</p>
                    <p className="text-xs text-gray-600">
                      {selectedSizes.slice(0, 5).join(", ")}
                      {selectedSizes.length > 5 ? "..." : ""}
                    </p>
                  </div>
                )}
                {variations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Estoque Total:</p>
                      <p className="text-sm font-medium text-gray-900">{getTotalStock()} unidades</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Variações:</p>
                      <p className="text-sm font-medium text-gray-900">{variations.length}</p>
                    </div>
                    {getOutOfStockVariations().length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-red-500">Sem estoque:</p>
                        <p className="text-sm font-medium text-red-600">{getOutOfStockVariations().length}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
