import { api } from "./api-client";

type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

interface ProductOption {
  name: string
  values: {
    id: string
    content?: string
    value: string
  }[]
}
interface ProductVariant {
  sku?: string
  price?: number | null
  comparePrice?: number | null
  stock?: number
  optionValueIds?: string[]
}

interface updateProductRequest {
  id: string
  name: string
  slug: string
  description?: string
  tags?: string
  brandId: string
  featured: boolean
  price: number
  comparePrice?: number | null
  weight?: number
  categoryIds: string[]
  options: ProductOption[]
  variants?: ProductVariant[]
}

export async function updateProduct({ id, name, slug, categoryIds, featured, options, price, comparePrice, description, brandId, tags, variants, weight }: updateProductRequest) {
  const result = await api.put(`products/${id}`, {
    json: {
      name,
      slug,
      categoryIds,
      featured,
      options,
      price,
      comparePrice,
      description,
      tags,
      variants,
      weight,
      brandId
    }
  })
  return result
}