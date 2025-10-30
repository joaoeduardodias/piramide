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

interface CreateProductRequest {
  name: string
  slug: string
  description?: string
  tags?: string
  brandId: string
  featured: boolean
  price: number
  comparePrice?: number | null
  status?: ProductStatus
  weight?: number
  categoryIds: string[]
  images: ProductImage[]
  options: ProductOption[]
  variants?: ProductVariant[]
}

interface CreateProductResponse {
  productId: string
}

export async function createProduct({
  categoryIds,
  comparePrice,
  description,
  featured,
  images,
  name,
  price,
  slug,
  status,
  tags,
  weight,
  brandId,
  options,
  variants
}: CreateProductRequest) {
  const result = await api.post('products', {
    json: {
      categoryIds,
      comparePrice,
      description,
      featured,
      images,
      name,
      price,
      slug,
      status,
      tags,
      weight,
      options,
      brandId,
      variants
    }
  }).json<CreateProductResponse>()
  return result

}