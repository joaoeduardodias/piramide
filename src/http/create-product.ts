import { api } from "./api-client";
type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

interface ProductImage {
  url: string
  alt?: string
  sortOrder?: number
}



interface ProductOption {
  name: string
  values: string[]
}
interface ProductVariant {
  sku?: string
  price?: number
  comparePrice?: number
  stock?: number
  optionValueIds?: string[]
}

interface CreateProductRequest {
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
  options?: ProductOption[]
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
      variants
    }
  }).json<CreateProductResponse>()

  console.log(result);
  return result

}