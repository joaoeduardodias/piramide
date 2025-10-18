"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import { AlertCircle, AlertTriangle, Check, FolderTree, ImageIcon, Loader2, Palette, Ruler, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createProductAction } from "../../actions"



const defaultColors = [
  { value: "Preto", content: "#000000" },
  { value: "Branco", content: "#FFFFFF" },
  { value: "Marrom", content: "#8B4513" },
  { value: "Azul", content: "#0000FF" },
  { value: "Vermelho", content: "#FF0000" },
  { value: "Verde", content: "#008000" },
  { value: "Cinza", content: "#808080" },
  { value: "Bege", content: "#F5F5DC" },
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
interface FormCreateProps {
  categories: {
    id: string
    name: string
  }[]
}

export function FormCreateProduct({ categories }: FormCreateProps) {

  const [colors, setColors] = useState(defaultColors)
  const [sizes, setSizes] = useState(defaultSizes)
  const [variations, setVariations] = useState<Variation[]>([])
  const [images, setImages] = useState<File[]>([])
  const [featured, setFeatured] = useState(true)
  const [selectedColors, setSelectedColors] = useState<{ value: string, content: string }[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [newSize, setNewSize] = useState("")
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [newColorName, setNewColorName] = useState<string>("")
  const [newColorValue, setNewColorValue] = useState<string>("#000000")

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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleColorToggle = (color: { value: string, content: string }) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c.value !== color.value)
      : [...selectedColors, color]
    setSelectedColors(newSelectedColors)
    const baseSkuName = (document.getElementById("name") as HTMLInputElement)?.value || ""
    const baseSku = getInitials(baseSkuName)
    updateVariations(newSelectedColors.map(c => c.value), selectedSizes, baseSku)
  }

  const handleSizeToggle = (size: string) => {
    const newSelectedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(newSelectedSizes)
    const baseSkuName = (document.getElementById("name") as HTMLInputElement)?.value || ""
    const baseSku = getInitials(baseSkuName)
    updateVariations(selectedColors.map(c => c.value), newSelectedSizes, baseSku)
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
    if (newColorName.trim() && !colors.find((c) => c.value === newColorName.trim())) {
      const newColor = {
        value: newColorName.trim(),
        content: newColorValue,
      }
      setColors((prev) => [...prev, newColor])
      setNewColorName("")
      setNewColorValue("#000000")
      setIsColorDialogOpen(false)
    }
  }
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(createProductAction)


  const options = [
    {
      name: "color",
      values: selectedColors
    },
    {
      name: "size",
      values: selectedSizes.map(size => ({ value: size })),
    },
  ]
  useEffect(() => {
    if (success === true) {
      toast.success("Produto criado com sucesso!")
    }
  }, [success])

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <input type="hidden" name="options" value={JSON.stringify(options)} />
        <input type="hidden" name="variations" value={JSON.stringify(variations)} />
        <input type="hidden" name="categories" value={JSON.stringify(selectedCategories)} />

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
              <Input id="name" name="name" placeholder="Ex: Tênis Urbano Premium" className={`mt-2 ${errors?.name ? "border-red-500" : ""}`} />
              {errors?.name && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" name="description" placeholder="Descreva as características..." rows={4} className={`mt-2 ${errors?.description ? "border-red-500" : ""}`} />
              {errors?.description && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.description[0]}</p>}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-semibold text-gray-900 flex items-center gap-2">
              <FolderTree className="size-5" />
              Categorias do Produto *
            </CardTitle>
            <p className="text-sm text-gray-600">Selecione uma ou mais categorias para classificar este produto</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id)
                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
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

            {errors?.categories && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="size-4" />
                {errors.categories[0]}
              </p>
            )}
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
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Palette size={16} /> Nova Cor</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Cor</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">Criação de cor</DialogDescription>

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
                  <div key={color.value} className={`relative cursor-pointer p-3 rounded-lg border-2 ${selectedColors.includes(color) ? "border-black" : "border-gray-200"}`} onClick={() => handleColorToggle(color)}>
                    <div className="size-8 rounded-full mx-auto mb-2 border" style={{ backgroundColor: color.content }} />
                    <p className="text-xs text-center">{color.value}</p>
                    {selectedColors.includes(color) &&
                      <div className="absolute top-1 right-1 size-5 bg-black rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
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
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Tamanho</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">Adicionar tamanho</DialogDescription>
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
                    <div className="size-8 rounded-full border" style={{ backgroundColor: colors.find(c => c.value === v.color)?.value }} />
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
              {/* <Switch id="featured" name="featured" checked={isFeatured} onCheckedChange={setIsFeatured} /> */}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Preços</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="0,00" className={`mt-2 ${errors?.price ? "border-red-500" : ""}`} />
              {errors?.price && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.price[0]}</p>}
            </div>
            <div>
              <Label htmlFor="comparePrice">Preço Comparativo *</Label>
              <Input id="comparePrice" name="comparePrice" type="number" step="0.01" placeholder="0,00" className="mt-2" />
              {errors?.comparePrice && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.comparePrice[0]}</p>}
            </div>

          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* <div>
              <Label htmlFor="sku">SKU Base *</Label>
              <Input id="sku" name="sku" placeholder="TENIS-001" className={`mt-2 ${errors?.sku ? "border-red-500" : ""}`} />
              {errors?.sku && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors?.sku}</p>}
            </div> */}

            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" name="weight" type="number" step="0.01" placeholder="0.5" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Publicar Produto
            </Button>
            {/* <Button type="submit" variant="outline" className="w-full" name="isDraft" value="true" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar como Rascunho
            </Button> */}
            {errors?.form && <p className="text-sm text-red-600 text-center">{errors.form[0]}</p>}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
