"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import { AlertCircle, AlertTriangle, Check, FolderTree, ImageIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { updateProductAction } from "../../actions"


type OptionValue = { id: string, value: string, content: string | null }
type SelectedOptions = Record<string, OptionValue[]>


interface Variant {
  id: string
  sku: string
  price: number | null
  comparePrice: number | null
  stock: number | null
  options?: Record<string, { value: string; content: string | null } | string>
  optionValueIds?: string[]
}



interface Image {
  id: string;
  url: string;
  alt: string | null;
  fileKey: string | null;
  sortOrder: number;
}


interface FormUpdateProps {
  categories: {
    id: string
    name: string
  }[]
  options: {
    name: string
    values: {
      id: string
      content: string | null
      value: string
    }[]
  }[]
  initialData: {
    id: string;
    name: string;
    description: string | null;
    featured: boolean;
    price: number;
    comparePrice: number | null;
    weight: number | null;
    images: {
      id: string;
      url: string;
      alt: string | null;
      fileKey: string | null;
      sortOrder: number;
    }[];
    variants: {
      id: string;
      price: number | null;
      comparePrice: number | null;
      sku: string;
      stock: number;
    }[];
    categories: string[]
    options: {
      id: string;
      name: string;
      values: {
        id: string;
        value: string;
        content: string | null;
      }[];
    }[];
  }
}

type ImageOrFile = File | Image


export function FormUpdateProduct({ categories, options, initialData }: FormUpdateProps) {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateProductAction)
  const defaultValues: Record<string, OptionValue[]> = Object.fromEntries(
    options.map(opt => {
      const key = opt.name.toLowerCase();
      const values: OptionValue[] = opt.values.map(v => ({
        id: v.id,
        value: v.value,
        content: v.content
      }));
      return [key, values];
    })
  );


  const [featured, setFeatured] = useState<boolean>(initialData.featured)
  const [images, setImages] = useState<ImageOrFile[]>(initialData.images)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData.categories)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    Object.fromEntries(
      (initialData.options || []).map((opt) => [opt.name.toLowerCase(), opt.values])
    )
  )
  const [variants, setVariants] = useState<Variant[]>(initialData.variants.map(variant => {
    return {
      id: variant.id,
      price: Number(variant.price),
      comparePrice: Number(variant.comparePrice),
      sku: variant.sku,
      stock: Number(variant.stock)
    }
  }))

  function getInitials(name: string): string {
    if (!name.trim()) return "";

    const parts = name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");

    return initials;
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleOptionToggle = (optionName: string, optionValue: OptionValue) => {
    setSelectedOptions(prev => {
      const currentValues = prev[optionName] || [];
      const exists = currentValues.some(v => v.id === optionValue.id);

      const updatedValues = exists
        ? currentValues.filter(v => v.id !== optionValue.id)
        : [...currentValues, optionValue];

      const newSelected = { ...prev, [optionName]: updatedValues };

      // Gerar variants
      const baseSkuName = (document.getElementById("name") as HTMLInputElement)?.value || "";
      const baseSku = getInitials(baseSkuName);

      const optionNames = Object.keys(newSelected);
      const optionValues = Object.values(newSelected).filter(arr => arr.length > 0) as OptionValue[][];

      const allCombinations = generateCombinations(optionValues);
      const newVariants = buildVariantsGeneric(allCombinations, optionNames, baseSku);
      setVariants(newVariants);

      return newSelected;
    });
  };

  function generateCombinations<T>(arrays: T[][]): T[][] {
    if (arrays.length === 0) return []
    return arrays.reduce<T[][]>(
      (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
      [[]]
    )
  }

  function buildVariantsGeneric(
    combinations: OptionValue[][],
    optionNames: string[],
    baseSku: string
  ): Variant[] {
    return combinations.map(combo => {
      const options: Record<string, OptionValue> = {};
      const optionValueIds: string[] = [];

      combo.forEach((opt, i) => {
        const name = optionNames[i];
        options[name] = { ...opt };
        optionValueIds.push(opt.id);
      });

      const sku = [baseSku, ...combo.map(v => v.value)].filter(Boolean).join("-").toUpperCase();

      return {
        id: sku,
        sku,
        price: 0,
        comparePrice: 0,
        stock: 0,
        options,
        optionValueIds
      };
    });
  }


  const updateVariantField = (id: string, field: keyof Variant, value: any) => {
    setVariants((prev) =>
      prev.map((varItem) =>
        varItem.id === id ? { ...varItem, [field]: value } : varItem
      )
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files)
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <input type="hidden" name="options" value={JSON.stringify(selectedOptions)} />
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />
        <input type="hidden" name="categories" value={JSON.stringify(selectedCategories)} />
        <input type="hidden" name="id" value={initialData.id} />

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
              <Input id="name" defaultValue={initialData.name} name="name" placeholder="Ex: Tênis Urbano Premium" className={`mt-2 ${errors?.name ? "border-red-500" : ""}`} />
              {errors?.name && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea id="description" defaultValue={initialData?.description ?? ''} name="description" placeholder="Descreva as características..." rows={4} className={`mt-2 ${errors?.description ? "border-red-500" : ""}`} />
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
                  {images.map((file, index) => {
                    const src =
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : file.url

                    return (
                      <img
                        key={index}
                        src={src}
                        alt={'alt' in file ? (file.alt ?? undefined) : `Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                        onLoad={(e) => {
                          if (file instanceof File) URL.revokeObjectURL(e.currentTarget.src)
                        }}
                      />
                    )
                  })}

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
          <CardHeader className="flex justify-between">
            <CardTitle>Seleção de Variações *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(defaultValues).map(([optionName, values]) => {
              const selected = selectedOptions[optionName] || []
              const isColorOption = values.some((v: any) => v && v.content)

              return (
                <div key={optionName}>
                  <Label className="capitalize mb-4">{optionName} *</Label>
                  <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
                    {values.map((val: OptionValue) => {
                      const valObj = { ...val, content: val.content || "#ccc" }
                      const isSelected = selected.some(v => v.id === valObj.id)

                      if (isColorOption) {
                        return (
                          <div
                            key={valObj.id}
                            className={`relative cursor-pointer p-3 rounded-lg border-2 ${isSelected ? "border-black" : "border-gray-200"}`}
                            onClick={() => handleOptionToggle(optionName, valObj)}
                          >
                            <div
                              className="size-8 rounded-full mx-auto mb-2 border"
                              style={{ backgroundColor: valObj.content }}
                            />
                            <p className="text-xs text-center">{valObj.value}</p>
                            {isSelected && (
                              <div className="absolute top-1 right-1 size-5 bg-black rounded-full flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <Button
                          key={valObj.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleOptionToggle(optionName, valObj)}
                        >
                          {valObj.value}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

          </CardContent>
        </Card>
        {variants.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Controle de Estoque</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {errors?.variants && (
                <p className="text-sm text-red-600 mb-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  {errors?.variants[0]}
                </p>
              )}

              {variants.map((v) => {
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border"
                  >

                    <div className="flex items-center gap-3 flex-1">
                      {v?.options?.color && (
                        <div
                          className="size-8 rounded-full border"
                          style={{
                            backgroundColor:
                              typeof v?.options.color === "string"
                                ? v?.options.color
                                : v?.options.color?.content || "#ccc",
                          }}
                        />
                      )}

                      <div>
                        <p className="font-medium">
                          {v.options && Object.entries(v?.options)
                            .map(([_, value]) => {
                              const displayValue = typeof value === "string" ? value : value.value
                              return `${displayValue}`
                            })
                            .join(" - ")}
                        </p>
                        <p className="text-xs text-gray-500">ID: {v.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-36">
                        <Label className="text-xs">SKU</Label>
                        <Input
                          value={v.sku}
                          onChange={(e) => updateVariantField(v.id, "sku", e.target.value)}
                          className="mt-1 h-9"
                        />
                      </div>

                      <div className="w-24">
                        <Label className="text-xs">Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={v.price === null ? "" : Number(v.price)}
                          onChange={(e) =>
                            updateVariantField(
                              v.id,
                              "price",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          className="mt-1 h-9"
                        />
                      </div>

                      <div className="w-28">
                        <Label className="text-xs">Preço Comp. (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={v.comparePrice === null ? "" : Number(v.comparePrice)}
                          onChange={(e) =>
                            updateVariantField(
                              v.id,
                              "comparePrice",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          className="mt-1 h-9"
                        />
                      </div>

                      <div className="w-24">
                        <Label className="text-xs">Estoque</Label>
                        <Input
                          type="number"
                          value={v.stock === null ? "" : v.stock}
                          onChange={(e) =>
                            updateVariantField(v.id, "stock", Number(e.target.value))
                          }
                          className="mt-1 h-9"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
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
              <Input id="price" defaultValue={initialData.price} name="price" type="number" step="0.01" placeholder="0,00" className={`mt-2 ${errors?.price ? "border-red-500" : ""}`} />
              {errors?.price && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.price[0]}</p>}
            </div>
            <div>
              <Label htmlFor="comparePrice">Preço Comparativo *</Label>
              <Input id="comparePrice" defaultValue={initialData.comparePrice ?? ''} name="comparePrice" type="number" step="0.01" placeholder="0,00" className="mt-2" />
              {errors?.comparePrice && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.comparePrice[0]}</p>}
            </div>

          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">


            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" defaultValue={initialData.weight ?? ''} name="weight" type="number" step="0.01" placeholder="0.5" className="mt-2" />
            </div>
          </CardContent>
        </Card>


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
    </form >
  )
}
