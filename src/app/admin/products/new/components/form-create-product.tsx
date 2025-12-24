"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormState } from "@/hooks/use-form-state"
import { getSignedUrl } from "@/http/get-signed-url"
import { formatReal } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState } from "react"

import { createProductAction } from "../../actions"
import type { ImageItem } from "../../components/image-upload"

import { FormCreateOption } from "./form-create-option"
import { ProductActions } from "./product-actions"
import { ProductBasicInfo } from "./product-basic-info"
import { ProductCategories } from "./product-categories"
import { ProductImages } from "./product-images"
import { ProductOptions } from "./product-options"
import { ProductPricing } from "./product-pricing"
import { ProductStatus } from "./product-status"
import { ProductVariants } from "./product-variants"


type OptionValue = { id: string; value: string; content: string | null }
type SelectedOptions = Record<string, OptionValue[]>

interface Variant {
  id: string
  sku: string
  price?: number
  comparePrice?: number
  stock: number
  options: Record<string, { value: string; content: string | null } | string>
}

interface FormCreateProps {
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
  options: {
    name: string
    values: { id: string; value: string; content: string | null }[]
  }[]
}


export function FormCreateProduct({
  categories,
  brands,
  options,
}: FormCreateProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [{ success, message, errors }, handleSubmit] = useFormState(
    createProductAction,
    () => router.push("/admin/products")
  )

  const [images, setImages] = useState<ImageItem[]>([])
  const [featured, setFeatured] = useState(false)
  const [brand, setBrand] = useState("")
  const [productName, setProductName] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const [variants, setVariants] = useState<Variant[]>([])
  const [price, setPrice] = useState("")
  const [isPending, setIsPending] = useState(false)
  function handleCategoryToggle(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const defaultOptions = useMemo(() => {
    return Object.fromEntries(
      options.map((opt) => [
        opt.name.toLowerCase(),
        opt.values.map((v) => ({
          id: v.id,
          value: v.value,
          content: v.content,
        })),
      ])
    )
  }, [options])

  const serializedVariants = useMemo(
    () => JSON.stringify(variants),
    [variants]
  )

  const serializedOptions = useMemo(
    () => JSON.stringify(selectedOptions),
    [selectedOptions]
  )

  const serializedCategories = useMemo(
    () => JSON.stringify(selectedCategories),
    [selectedCategories]
  )

  const handlePriceChange = (value: string) => {
    setPrice(formatReal(value))
  }

  const handleUploadImages = useCallback(async () => {
    if (!images.length) return

    if (!formRef.current) return


    const { uploads } = await getSignedUrl({
      files: images.map((img) => ({
        fileName: img.file!.name,
        contentType: img.file!.type,
      })),
    })

    await Promise.all(
      uploads.map((upload, index) =>
        fetch(upload.presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": upload.contentType },
          body: images[index].file,
        })
      )
    )

    const finalImages = uploads.map((upload, index) => ({
      fileKey: upload.fileKey,
      url: upload.url,
      sortOrder: index,
    }))

    const input =
      formRef.current.querySelector<HTMLInputElement>('input[name="filesUpload"]') ??
      Object.assign(document.createElement("input"), {
        type: "hidden",
        name: "filesUpload",
      })

    input.value = JSON.stringify(finalImages)
    formRef.current.appendChild(input)
  }, [images])



  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <input type="hidden" name="options" value={serializedOptions} />
      <input type="hidden" name="variants" value={serializedVariants} />
      <input type="hidden" name="categories" value={serializedCategories} />
      <input type="hidden" name="brandId" value={brand} />

      <div className="lg:col-span-2 space-y-8">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductBasicInfo
              name={productName}
              setName={setProductName}
              brands={brands}
              brand={brand}
              setBrand={setBrand}
              success={success}
              message={message}
              errors={errors}
            />
          </CardContent>
        </Card>
        <ProductCategories
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={handleCategoryToggle}
          errors={errors}
        />

        <Card>
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImages
              images={images}
              setImages={setImages}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex justify-between">
            <CardTitle>Seleção de Variações *</CardTitle>
            <FormCreateOption />
          </CardHeader>
          <CardContent>
            <ProductOptions
              productName={productName}
              defaultOptions={defaultOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              setVariants={setVariants}
              errors={errors}
            />
          </CardContent>
        </Card>

        {variants.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductVariants
                variants={variants}
                setVariants={setVariants}
                errors={errors}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* RIGHT */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductStatus
              featured={featured}
              setFeatured={setFeatured}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProductPricing
              price={price}
              onPriceChange={handlePriceChange}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductActions
              isPending={isPending}
              error={errors?.form?.[0]}
              onSubmit={async () => {
                try {
                  setIsPending(true)
                  await handleUploadImages()
                  formRef.current?.requestSubmit()
                } finally {
                  setIsPending(false)
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
