"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import { getSignedUrl } from "@/http/get-signed-url"
import { formatReal } from "@/lib/validations"
import { convertToFile } from "@/utils/convert-object-to-file"
import { AlertCircle, AlertTriangle, Check, FolderTree, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { updateProductAction } from "../../actions"
import ImageUpload from "../../components/image-upload"
import { FormCreateOption } from "../../new/components/form-create-option"
import { FormCreateOptionValue } from "../../new/components/form-create-option-value"

type OptionValue = { id: string; value: string; content: string | null }
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

interface ImageItem {
  id: string;
  url: string;
  alt: string | null;
  fileKey: string | null;
  sortOrder: number;
}

interface FileUpload {
  fileKey: string;
  url: string;
  sortOrder: number;
}

interface UploadedFile extends File {
  // marcação opcional caso queira estender
}

interface FormUpdateProps {
  categories: {
    id: string
    name: string
  }[]
  brands: {
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
    images: ImageItem[]
    brand: {
      id: string;
      name: string;
    }
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

export function FormUpdateProduct({ categories, options, brands, initialData }: FormUpdateProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement | null>(null)
  const hasConvertedRef = useRef(false)
  const [isPending, setIsPending] = useState(false)
  const [{ success, message, errors }, handleSubmit] = useFormState(updateProductAction, () => {
    router.push('/admin/products')
  })

  const [name, setName] = useState<string>(initialData.name ?? "")
  const [featured, setFeatured] = useState<boolean>(initialData.featured)
  const [description, setDescription] = useState<string>(initialData?.description ?? "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData.categories ?? [])
  const [brand, setBrand] = useState<string>(String(initialData?.brand?.id ?? ""))
  const [images, setImages] = useState<UploadedFile[]>([])
  const [originalState, setOriginalState] = useState<string>("")
  const [hasChanged, setHasChanged] = useState(false)

  const [price, setPrice] = useState(() => formatReal(String(initialData.price ?? "")))
  const [comparePrice, setComparePrice] = useState(() => formatReal(String(initialData.comparePrice ?? "")))

  // === memoized default values (options) ===
  const defaultValues = useMemo<Record<string, OptionValue[]>>(() => {
    return Object.fromEntries(
      options.map(opt => {
        const key = opt.name.toLowerCase()
        const values: OptionValue[] = opt.values.map(v => ({
          id: v.id,
          value: v.value,
          content: v.content
        }))
        return [key, values]
      })
    )
  }, [options])

  const initialSelectedOptions = useMemo<SelectedOptions>(() => {
    return Object.fromEntries(
      (initialData.options || []).map(opt => [opt.name.toLowerCase(), opt.values.map(v => ({ id: v.id, value: v.value, content: v.content }))])
    )
  }, [initialData.options])

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialSelectedOptions)

  const [variants, setVariants] = useState<Variant[]>(
    () =>
      (initialData.variants || []).map((variant) => ({
        id: variant.id,
        price: variant.price === null ? 0 : Number(variant.price),
        comparePrice: variant.comparePrice === null ? 0 : Number(variant.comparePrice),
        sku: variant.sku,
        stock: variant.stock ?? 0
      }))
  )

  function getInitials(productName: string): string {
    const trimmed = (productName ?? "").trim()
    if (!trimmed) return ""
    const parts = trimmed.split(/\s+/)
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join("")
  }

  const generateCombinations = useCallback(<T,>(arrays: T[][]): T[][] => {
    if (!arrays || arrays.length === 0) return []
    return arrays.reduce<T[][]>(
      (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
      [[]]
    )
  }, [])

  function buildVariantsGeneric(
    combinations: OptionValue[][],
    optionNames: string[],
    baseSku: string
  ): Variant[] {
    if (!combinations || combinations.length === 0) return []
    return combinations.map(combo => {
      const options: Record<string, OptionValue> = {}
      const optionValueIds: string[] = []

      combo.forEach((opt, i) => {
        const name = optionNames[i]
        options[name] = { ...opt }
        optionValueIds.push(opt.id)
      })

      const sku = [baseSku, ...combo.map(v => v.value)].filter(Boolean).join("-").toUpperCase()

      return {
        id: sku,
        sku,
        price: 0,
        comparePrice: 0,
        stock: 0,
        options,
        optionValueIds
      }
    })
  }

  async function convertImagesToFiles(imagesList: ImageItem[]): Promise<UploadedFile[]> {
    const promises = imagesList.map((img, i) => convertToFile(img.url, img.fileKey ?? `image-${i}.jpg`))
    return Promise.all(promises) as Promise<UploadedFile[]>
  }

  useEffect(() => {
    if (hasConvertedRef.current) return
    hasConvertedRef.current = true

    if (initialData.images && initialData.images.length > 0) {
      convertImagesToFiles(initialData.images)
        .then(result => {
          setImages(result)
          setOriginalState(JSON.stringify(result.map(f => f.name)))
        })
        .catch(err => {
          console.error("Falha na conversão de imagens:", err)
        })
    }
  }, [initialData.images])

  useEffect(() => {
    const currentState = JSON.stringify(images.map(f => f.name))
    setHasChanged(currentState !== originalState)
  }, [images, originalState])

  const handleOptionToggle = useCallback((optionName: string, optionValue: OptionValue) => {
    setSelectedOptions(prev => {
      const key = optionName
      const currentValues = prev[key] || []
      const exists = currentValues.some(v => v.id === optionValue.id)
      const updatedValues = exists ? currentValues.filter(v => v.id !== optionValue.id) : [...currentValues, optionValue]
      const newSelected = { ...prev, [key]: updatedValues }


      const baseSku = getInitials(name)
      const optionNames = Object.keys(newSelected)
      const optionValues = Object.values(newSelected).filter(arr => arr.length > 0) as OptionValue[][]

      const allCombinations = generateCombinations(optionValues)
      const newVariants = buildVariantsGeneric(allCombinations, optionNames, baseSku)
      setVariants(newVariants)

      return newSelected
    })
  }, [generateCombinations, buildVariantsGeneric, name])

  const updateVariantField = useCallback((id: string, field: keyof Variant, value: any) => {
    setVariants(prev => prev.map(v => (v.id === id ? { ...v, [field]: value } : v)))
  }, [])

  const handleCategoryToggle = useCallback((category: string) => {
    setSelectedCategories(prev => (prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]))
  }, [])


  const setHiddenInputValue = useCallback((name: string, value: string) => {
    const form = formRef.current
    if (!form) return
    let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`)
    if (!input) {
      input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      form.appendChild(input)
    }
    input.value = value
  }, [])

  const handleUploadImage = useCallback(async (): Promise<void> => {
    try {
      if (!hasChanged) {

        return
      }

      const originalImages = initialData.images || []
      const originalKeys = originalImages.map(img => img.fileKey).filter(Boolean) as (string | null)[]

      const newImages = images.filter(file => !originalKeys.includes(file.name))

      const existingMapping = originalImages.reduce<{ [key: string]: ImageItem }>((acc, img) => {
        if (img.fileKey) acc[img.fileKey] = img
        return acc
      }, {})

      if (newImages.length === 0) {
        const updated = images.map((file, i) => {
          const existing = existingMapping[file.name]
          return {
            fileKey: existing?.fileKey || file.name,
            url: existing?.url || "",
            sortOrder: i + 1
          }
        })
        setHiddenInputValue("filesUpload", JSON.stringify(updated))
        return
      }

      const { uploads } = await getSignedUrl({
        files: newImages.map((file, i) => ({
          fileName: file.name,
          contentType: file.type || "image/png",
          sortOrder: i + 1
        }))
      })

      await Promise.all(
        uploads.map((u, i) =>
          fetch(u.presignedUrl, {
            method: "PUT",
            headers: {
              "Content-Type": u.contentType,
              "x-mime-type": u.contentType
            },
            body: newImages[i]
          })
        )
      )

      const keptImages = originalImages.filter(img => images.some(f => f.name === img.fileKey))

      const uploadsCopy = [...uploads]
      const combined = [...keptImages, ...uploadsCopy]

      const final = images.map((file, i) => {
        const match = combined.find(img => img.fileKey === file.name)
        if (match) {
          return {
            fileKey: match.fileKey || file.name,
            url: match.url || "",
            sortOrder: i + 1
          }
        }
        const fallback = uploadsCopy.shift()
        return {
          fileKey: fallback?.fileKey || file.name,
          url: fallback?.url || "",
          sortOrder: i + 1
        }
      })

      setHiddenInputValue("filesUpload", JSON.stringify(final))
    } catch (err) {
      console.error("Erro no upload de imagens:", err)
      throw err
    }
  }, [hasChanged, images, initialData.images, setHiddenInputValue])


  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(formatReal(e.target.value))
  }

  function handleComparePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComparePrice(formatReal(e.target.value))
  }

  const onActionButtonClick = useCallback(async () => {
    if (isPending) return

    setIsPending(true)
    try {
      setHiddenInputValue("options", JSON.stringify(selectedOptions))
      setHiddenInputValue("variants", JSON.stringify(variants))
      setHiddenInputValue("categories", JSON.stringify(selectedCategories))
      setHiddenInputValue("brandId", String(brand))
      setHiddenInputValue("featured", featured ? "true" : "false")
      setHiddenInputValue("price", price.replace(/[^\d,]/g, "").replace(",", "."))
      setHiddenInputValue("comparePrice", comparePrice.replace(/[^\d,]/g, "").replace(",", "."))
      setHiddenInputValue("weight", String((formRef.current?.querySelector<HTMLInputElement>('input[name="weight"]')?.value) ?? ""))
      setHiddenInputValue("description", description)

      await handleUploadImage()

      formRef.current?.requestSubmit()
    } catch (err) {
      console.error("Erro ao atualizar produto:", err)
    } finally {
      setIsPending(false)
    }
  }, [
    isPending,
    setHiddenInputValue,
    selectedOptions,
    variants,
    selectedCategories,
    brand,
    featured,
    price,
    comparePrice,
    handleUploadImage,
    description,
  ])

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <input type="hidden" name="id" value={initialData.id} />
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tênis Urbano Premium"
                className={`mt-2 ${errors?.name ? "border-red-500" : ""}`}
              />
              {errors?.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />{errors.name[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as características..."
                rows={4}
                className={`mt-2 ${errors?.description ? "border-red-500" : ""}`}
              />
              {errors?.description && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={16} />{errors.description[0]}
                </p>
              )}
            </div>
            <div>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Marca do Produto *" />
                </SelectTrigger>
                <SelectContent>
                  {brands && brands.length > 0 ? (
                    brands.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="p-2 hover:bg-gray-100">
                        {b.name}
                      </SelectItem>
                    ))
                  ) : (
                    <Link href="/admin/brands/new">
                      <div className="p-2 text-sm text-gray-500 flex items-center justify-center">
                        Crie uma Marca <Plus className="size-3 ml-1" />
                      </div>
                    </Link>
                  )}
                </SelectContent>
              </Select>
              {errors?.brand && (
                <p className="text-sm text-red-600 mb-2 flex items-center gap-1">
                  <AlertCircle size={16} />{errors.brand[0]}
                </p>
              )}
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
          <CardHeader>
            <CardTitle>Imagens do Produto *</CardTitle>
            <p className="text-sm text-muted-foreground">
              A primeira imagem será usada como imagem principal. Arraste as imagens para reordená-las.
            </p>
          </CardHeader>
          <CardContent>
            <ImageUpload images={images} setImages={setImages} />
            {errors?.images && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle size={16} />{errors.images[0]}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex justify-between">
            <CardTitle>Seleção de Variações *</CardTitle>
            <FormCreateOption />
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(defaultValues).map(([optionName, values]) => {
              const selected = selectedOptions[optionName] || []
              const isColorOption = values.some(v => v && v.content)

              return (
                <div key={optionName}>
                  <div className=" flex items-center justify-between  mb-4">
                    <Label className="capitalize">{optionName} *</Label>
                    <FormCreateOptionValue optionName={optionName} />
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6  gap-1">
                    {values.map((val: OptionValue) => {
                      const valObj = { ...val, content: val.content || "#ccc" }
                      const isSelected = selected.some(v => v.id === valObj.id)

                      if (isColorOption) {
                        return (
                          <div
                            key={valObj.id}
                            className={`relative cursor-pointer p-3  rounded-lg border-2 ${isSelected ? "border-black" : "border-gray-200"}`}
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

              {variants.map((v) => (
                <div key={v.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border">
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
                            const displayValue = typeof value === "string" ? value : (value as any).value
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
                      <Input value={v.sku} onChange={(e) => updateVariantField(v.id, "sku", e.target.value)} className="mt-1 h-9" />
                    </div>

                    <div className="w-24">
                      <Label className="text-xs">Preço (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={v.price === null ? "" : Number(v.price)}
                        onChange={(e) => updateVariantField(v.id, "price", e.target.value === "" ? 0 : Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>

                    <div className="w-28">
                      <Label className="text-xs">Preço Comp. (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={v.comparePrice === null ? "" : Number(v.comparePrice)}
                        onChange={(e) => updateVariantField(v.id, "comparePrice", e.target.value === "" ? 0 : Number(e.target.value))}
                        className="mt-1 h-9"
                      />
                    </div>

                    <div className="w-24">
                      <Label className="text-xs">Estoque</Label>
                      <Input type="number" value={v.stock === null ? "" : v.stock} onChange={(e) => updateVariantField(v.id, "stock", Number(e.target.value))} className="mt-1 h-9" />
                    </div>
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
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <Input id="price" name="price_formatted" value={price} onChange={handlePriceChange} placeholder="R$ 0,00" className={`mt-2 ${errors?.price ? "border-red-500" : ""}`} />
              <input type="hidden" name="price" value={price.replace(/[^\d,]/g, "").replace(",", ".")} />
              {errors?.price && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.price[0]}</p>}
            </div>
            <div>
              <Label htmlFor="comparePrice">Preço Comparativo</Label>
              <Input id="comparePrice" name="comparePrice_formatted" value={comparePrice} onChange={handleComparePriceChange} placeholder="R$ 0,00" className={`mt-2 ${errors?.comparePrice ? "border-red-500" : ""}`} />
              <input type="hidden" name="comparePrice" value={comparePrice.replace(/[^\d,]/g, "").replace(",", ".")} />
              {errors?.comparePrice && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={16} />{errors.comparePrice[0]}</p>}
            </div>
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" name="weight" defaultValue={initialData.weight ?? ''} type="number" step="0.01" placeholder="0.5" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              className="w-full"
              onClick={onActionButtonClick}
              disabled={isPending}
              aria-busy={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  Atualizando
                  <Loader2 className="animate-spin size-4" />
                </span>
              ) : (
                'Atualizar Produto'
              )}
            </Button>
            {errors?.form && <p className="text-sm text-red-600 text-center">{errors.form[0]}</p>}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
