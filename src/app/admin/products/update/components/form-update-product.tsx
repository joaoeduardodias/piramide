"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import { AlertCircle, AlertTriangle, Check, ImageIcon, Loader2, Palette, Ruler, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { updateProductAction } from "../[id]/actions"



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
  comparePrice?: number
}
interface FormUpdateProps {
  categories: {
    id: string
    name: string
  }[],
  initialData: {
    id: string;
    name: string;
    slug: string;
    sales: number;
    featured: boolean | null;
    description: string | null;
    price: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
    categories: {
      categoryId: string;
      productId: string;
      category: {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
    images: {
      id: string;
      url: string;
      alt: string | null;
      sortOrder: number;
      productId: string;
      createdAt: Date;
      optionValueId: string | null;
    }[];
    variants: {
      id: string;
      price?: number;
      comparePrice?: number;
      sku: string;
      stock: number;
    }[];
  }
}

export function FormUpdateProduct({ categories, initialData }: FormUpdateProps) {


  const [colors, setColors] = useState(defaultColors)
  const [sizes, setSizes] = useState(defaultSizes)
  const [variations, setVariations] = useState<Variation[]>(initialData.variations)
  const [images, setImages] = useState<File[]>(initialData.images)
  const [featured, setFeatured] = useState(initialData.featured)
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData.colors)
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData.sizes)

  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [newSize, setNewSize] = useState("")
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [newColorName, setNewColorName] = useState("")
  const [newColorValue, setNewColorValue] = useState("#000000")


  function getInitials(name: string): string {
    if (!name.trim()) return "";
    const parts = name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");

    return initials;
  }
  const generateVariationId = (color: string, size: string) => `${color}-${size}`.toLowerCase().replace(/\s+/g, "-")
  const generateVariationSku = (baseSku: string, color: string, size: string) => `${baseSku}-${color.substring(0, 3).toUpperCase()}-${size}`

  const updateVariations = (colorsToUpdate: string[], sizesToUpdate: string[], baseSku: string) => {
    const newVariations: Variation[] = []
    colorsToUpdate.forEach((color) => {
      sizesToUpdate.forEach((size) => {
        const id = generateVariationId(color, size)
        const existingVariation = variations.find((v) => v.id === id)
        newVariations.push({
          id,
          color,
          size,
          stock: existingVariation?.stock ?? 0, // ok deixar 0 para estoque
          sku: existingVariation?.sku || generateVariationSku(baseSku || "PROD", color, size),
          price: existingVariation?.price ?? undefined,
          comparePrice: existingVariation?.comparePrice ?? undefined,
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
    const baseSkuName = (document.getElementById("name") as HTMLInputElement)?.value || ""
    const baseSku = getInitials(baseSkuName)
    updateVariations(newSelectedColors, selectedSizes, baseSku)
  }

  const handleSizeToggle = (size: string) => {
    const newSelectedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(newSelectedSizes)
    const baseSkuName = (document.getElementById("name") as HTMLInputElement)?.value || ""
    const baseSku = getInitials(baseSkuName)
    updateVariations(selectedColors, newSelectedSizes, baseSku)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariationChange = (id: string, field: keyof Variation, value: string | number) => {
    setVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    )
  }

  const removeVariation = (id: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== id))
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

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateProductAction)


  const options = [
    {
      name: "color",
      values: selectedColors,
    },
    {
      name: "size",
      values: selectedSizes,
    },
  ]
  useEffect(() => {
    if (success === true) {
      toast.success("Produto atualizado com sucesso!")
    }
  }, [success])

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <input type="hidden" name="options" value={JSON.stringify(options)} />
        <input type="hidden" name="variations" value={JSON.stringify(variations)} />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {success === false && message && (
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertTitle>
                  Erro ao Criar Produto
                </AlertTitle>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input id="name" name="name" defaultValue={initialData.name} placeholder="Ex: Tênis Urbano Premium" className={`mt-2 ${errors?.name ? "border-red-500" : ""}`} />
              {errors?.name && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" defaultValue={initialData?.description} name="description" placeholder="Descreva as características..." rows={4} className={`mt-2 ${errors?.description ? "border-red-500" : ""}`} />
              {errors?.description && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.description[0]}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select name="category" defaultValue={initialData.category}>
                  <SelectTrigger className={`mt-2 ${errors?.categories ? "border-red-500" : ""}`}>
                    <SelectValue placeholder={`Selecione uma categoria`} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.category && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.category[0]}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Imagens do Produto *</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative group">
                  <Image src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} width={150} height={150} className="w-full h-32 object-cover rounded-lg border" onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 size-6 opacity-0 group-hover:opacity-100" onClick={() => removeImage(index)}><X size={12} /></Button>
                  {index === 0 && <Badge className="absolute bottom-2 left-2">Principal</Badge>}
                </div>
              ))}
              <label className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                <ImageIcon className="size-8 text-gray-400" />
                <span className="text-sm text-gray-600">Adicionar</span>
                <input name="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {errors?.images && <p className="text-sm text-red-600 mt-2 flex items-center gap-1"><AlertCircle size={16} />{errors.images[0]}</p>}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Seleção de Variações *</CardTitle></CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Cores Disponíveis *</Label>
                <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" size="sm"><Palette size={16} /> Nova Cor</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Adicionar Nova Cor</DialogTitle></DialogHeader>
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
                                  name="colorName"
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
                                    name="colorValue"
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
                      {errors?.colors && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                          <AlertCircle className="size-4" />
                          {errors.colors[0]}
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colors.map((color) => (
                  <div key={color.name} className={`relative cursor-pointer p-3 rounded-lg border-2 ${selectedColors.includes(color.name) ? "border-black" : "border-gray-200"}`} onClick={() => handleColorToggle(color.name)}>
                    <div className="size-8 rounded-full mx-auto mb-2 border" style={{ backgroundColor: color.value }} />
                    <p className="text-xs text-center">{color.name}</p>
                    {selectedColors.includes(color.name) && <div className="absolute top-1 right-1 size-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Tamanhos Disponíveis *</Label>
                <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" size="sm"><Ruler size={16} /> Novo Tamanho</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Adicionar Novo Tamanho</DialogTitle></DialogHeader>
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
                                  name="sizeName"
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
                      {errors?.sizes && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                          <AlertCircle className="size-4" />
                          {errors.sizes[0]}
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                {sizes.map((size) => (
                  <Button key={size} type="button" variant={selectedSizes.includes(size) ? "default" : "outline"} onClick={() => handleSizeToggle(size)}>{size}</Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {variations.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle>Controle de Estoque</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {errors?.variations && <p className="text-sm text-red-600 mb-2 flex items-center gap-1"><AlertCircle size={16} />{errors?.variations}</p>}
              {variations.map((v) => (
                <div key={v.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="size-8 rounded-full border" style={{ backgroundColor: colors.find(c => c.name === v.color)?.value }} />
                    <div>
                      <p className="font-medium">{v.color} - {v.size}</p>
                      <p className="text-xs text-gray-500">ID: {v.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-36">
                      <Label className="text-xs">SKU</Label>
                      <Input value={v.sku} onChange={(e) => handleVariationChange(v.id, "sku", e.target.value)} className="mt-1 h-9" />
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Preço (R$)</Label>
                      <Input type="number" step="0.01" value={v.price === undefined ? "" : v.price} onChange={(e) => {
                        const inputValue = e.target.value;
                        handleVariationChange(
                          v.id,
                          "price",
                          inputValue === "" ? "" : Number(inputValue)
                        );
                      }}
                        className="mt-1 h-9" />
                    </div> <div className="w-28">
                      <Label className="text-xs">Preço Comp. (R$)</Label>
                      <Input type="number" step="0.01" value={v.comparePrice === undefined ? "" : v.comparePrice}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          handleVariationChange(
                            v.id,
                            "comparePrice",
                            inputValue === "" ? "" : Number(inputValue)
                          );
                        }}
                        className="mt-1 h-9" />
                    </div>
                    <div className="w-24">
                      <Label className="text-xs">Estoque</Label>
                      <Input type="number" value={v.stock} onChange={(e) => handleVariationChange(v.id, "stock", Number(e.target.value))} className="mt-1 h-9" />
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariation(v.id)} className="text-red-500"><Trash2 size={16} /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-8">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Status do Produto</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="featured">Produto em Destaque</Label>
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              <input type="hidden" name="featured" value={featured ? "true" : "false"} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Preços</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <Input id="price" name="price" defaultValue={initialData.price} type="number" step="0.01" placeholder="0,00" className={`mt-2 ${errors?.price ? "border-red-500" : ""}`} />
              {errors?.price && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.price[0]}</p>}
            </div>
            <div>
              <Label htmlFor="comparePrice">Preço Comparativo *</Label>
              <Input id="comparePrice" name="comparePrice" defaultValue={initialData.comparePrice} type="number" step="0.01" placeholder="0,00" className="mt-2" />
              {errors?.comparePrice && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.comparePrice[0]}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" defaultValue={initialData.weight} name="weight" type="number" step="0.01" placeholder="0.5" className="mt-2" />
          </CardContent>
        </Card>

        {/* Ações */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Atualizar Produto
            </Button>
            {errors?.form && <p className="text-sm text-red-600 text-center">{errors.form[0]}</p>}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
