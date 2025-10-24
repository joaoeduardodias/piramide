import { api } from "./api-client";

type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

interface ProductImage {
  url: string
  alt?: string
  sortOrder?: number
  fileKey?: string
}

interface ProductOption {
  name: string
  values: {
    content?: string
    value: string
  }[]
}
interface ProductVariant {
  sku?: string
  price?: number
  comparePrice?: number
  stock?: number
  optionValueIds?: string[]
}

interface updateProductRequest {
  id: string
  name: string
  slug: string
  description?: string
  tags?: string
  featured: boolean
  price: number
  comparePrice?: number
  status?: ProductStatus
  weight?: number
  categoryIds: string[]
  images: ProductImage[]
  // options: ProductOption[]
  variants?: ProductVariant[]
}

export async function updateProduct({ id, name, slug }: updateProductRequest) {
  const result = await api.put(`categories/${id}`, { json: { name, slug } })
  return result
}