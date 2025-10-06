"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Eye,
  ImageIcon,
  MoveDown,
  MoveUp,
  Package,
  Palette,
  Plus,
  Ruler,
  Save,
  Star,
  Tag,
  Upload,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const mockProduct = {
  id: 1,
  name: "Tênis Urbano Premium",
  slug: "tenis-urbano-premium",
  description:
    "Tênis urbano premium com tecnologia de amortecimento avançada e design moderno. Ideal para uso diário e atividades casuais.",
  shortDescription: "Tênis urbano premium com tecnologia de amortecimento avançada",
  sku: "TENIS-001",
  category: "Tênis",
  price: 299.9,
  comparePrice: 399.9,
  cost: 150.0,
  stock: 45,
  minStock: 10,
  status: "active",
  featured: true,
  metaTitle: "Tênis Urbano Premium - Conforto e Estilo",
  metaDescription: "Descubra o tênis urbano premium com tecnologia de amortecimento. Perfeito para o dia a dia.",
  tags: ["tênis", "urbano", "premium", "conforto"],
  sizes: ["38", "39", "40", "41", "42", "43"],
  colors: [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Cinza", hex: "#808080" },
  ],
  images: [
    { id: 1, url: "/placeholder.svg?height=400&width=400&text=Tênis+Principal", isMain: true },
    { id: 2, url: "/placeholder.svg?height=400&width=400&text=Tênis+Lateral", isMain: false },
    { id: 3, url: "/placeholder.svg?height=400&width=400&text=Tênis+Traseira", isMain: false },
    { id: 4, url: "/placeholder.svg?height=400&width=400&text=Tênis+Solado", isMain: false },
  ],
}

const categories = [
  "Tênis",
  "Sapatos Sociais",
  "Botas",
  "Sandálias",
  "Chinelos",
  "Sapatênis",
  "Mocassins",
  "Esportivos",
]

export default function UpdateProductPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [formData, setFormData] = useState(mockProduct)
  const [newTag, setNewTag] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" })

  // Load product data
  useEffect(() => {
    // Simular carregamento dos dados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: event.target?.result as string,
          isMain: formData.images.length === 0,
        }
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImage],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageId: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }))
  }

  const setMainImage = (imageId: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    }))
  }

  const moveImage = (imageId: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const images = [...prev.images]
      const currentIndex = images.findIndex((img) => img.id === imageId)
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      if (newIndex >= 0 && newIndex < images.length) {
        ;[images[currentIndex], images[newIndex]] = [images[newIndex], images[currentIndex]]
      }

      return { ...prev, images }
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()].sort((a, b) => Number.parseInt(a) - Number.parseInt(b)),
      }))
      setNewSize("")
    }
  }

  const removeSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }))
  }

  const addColor = () => {
    if (newColor.name.trim() && !formData.colors.some((c) => c.name === newColor.name.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, { ...newColor, name: newColor.name.trim() }],
      }))
      setNewColor({ name: "", hex: "#000000" })
    }
  }

  const removeColor = (colorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color.name !== colorToRemove),
    }))
  }

  const handleSave = async (publish = false) => {
    setIsSaving(true)

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Salvando produto:", { ...formData, status: publish ? "active" : "draft" })

    setIsSaving(false)
    router.push("/admin/products")
  }

  const calculateMargin = () => {
    if (formData.cost > 0) {
      return (((formData.price - formData.cost) / formData.price) * 100).toFixed(1)
    }
    return "0"
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
            <p className="text-gray-600 mt-1">Atualize as informações do produto</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Rascunho
          </Button>
          <Button onClick={() => handleSave(true)} disabled={isSaving} className="bg-black hover:bg-gray-800">
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Digite o nome do produto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Ex: TENIS-001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição Completa</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva detalhadamente o produto..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Descrição Resumida</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  placeholder="Descrição curta para listagens"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Imagens do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Clique para adicionar imagens ou arraste e solte</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB cada</p>
                  </label>
                </div>

                {/* Images Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Produto ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Main Image Badge */}
                        {image.isMain && (
                          <Badge className="absolute top-2 left-2 bg-black text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Principal
                          </Badge>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!image.isMain && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-6 h-6"
                              onClick={() => setMainImage(image.id)}
                              title="Definir como principal"
                            >
                              <Star className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-6 h-6"
                            onClick={() => removeImage(image.id)}
                            title="Remover imagem"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Move Buttons */}
                        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-6 h-6"
                              onClick={() => moveImage(image.id, "up")}
                              title="Mover para cima"
                            >
                              <MoveUp className="w-3 h-3" />
                            </Button>
                          )}
                          {index < formData.images.length - 1 && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-6 h-6"
                              onClick={() => moveImage(image.id, "down")}
                              title="Mover para baixo"
                            >
                              <MoveDown className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Preços e Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço de Venda *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Preço Comparativo</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Custo do Produto</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="mt-1"
                  />
                </div>
              </div>

              {formData.cost > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Margem de Lucro:</strong> {calculateMargin()}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variations */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Variações do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sizes */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Ruler className="w-4 h-4" />
                  Tamanhos Disponíveis
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.sizes.map((size) => (
                    <Badge key={size} variant="outline" className="bg-gray-50 px-3 py-1">
                      {size}
                      <button onClick={() => removeSize(size)} className="ml-2 text-gray-500 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Ex: 42"
                    className="w-24"
                  />
                  <Button onClick={addSize} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4" />
                  Cores Disponíveis
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.colors.map((color) => (
                    <Badge key={color.name} variant="outline" className="bg-gray-50 px-3 py-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                      <button onClick={() => removeColor(color.name)} className="ml-2 text-gray-500 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newColor.name}
                    onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da cor"
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={newColor.hex}
                    onChange={(e) => setNewColor((prev) => ({ ...prev, hex: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Button onClick={addColor} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                SEO e Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Título SEO</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="Título para mecanismos de busca"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 caracteres</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Descrição SEO</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="Descrição para mecanismos de busca"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 caracteres</p>
              </div>

              <div>
                <Label>Tags do Produto</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 px-3 py-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 text-blue-500 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Status do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Visibilidade</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Produto em Destaque</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              {formData.stock <= formData.minStock && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Estoque baixo!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                {formData.images.length > 0 && (
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={formData.images.find((img) => img.isMain)?.url || formData.images[0].url}
                      alt={formData.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 mb-1">{formData.name || "Nome do produto"}</h3>
                <p className="text-sm text-gray-600 mb-2">{formData.shortDescription || "Descrição do produto"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {formData.price.toFixed(2).replace(".", ",")}
                  </span>
                  {formData.comparePrice > formData.price && (
                    <span className="text-sm text-gray-500 line-through">
                      R$ {formData.comparePrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
