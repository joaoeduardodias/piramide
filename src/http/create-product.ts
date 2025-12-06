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

interface ProductImages {
  url: string
  alt?: string
  sortOrder: number
  fileKey: string
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
  options: ProductOption[]
  variants?: ProductVariant[]
  images: ProductImages[]
}

interface CreateProductResponse {
  productId: string
}

export async function createProduct({
  categoryIds,
  comparePrice,
  description,
  featured,
  name,
  price,
  slug,
  tags,
  weight,
  brandId,
  options,
  variants,
  images
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
      status: 'PUBLISHED',
      tags,
      weight,
      options,
      brandId,
      variants
    }
  }).json<CreateProductResponse>()
  return result

}