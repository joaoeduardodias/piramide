export interface ProductVariation {
  id?: string
  color: string
  size: string
  stock: number
  sku: string
  price?: number
  images?: string[]
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  category: string
  price: number
  comparePrice?: number
  cost?: number
  sku: string
  barcode?: string
  weight?: number
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  variations: ProductVariation[]
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  description: string
  shortDescription?: string
  category: string
  price: number
  comparePrice?: number
  cost?: number
  sku: string
  barcode?: string
  weight?: number
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  variations: Omit<ProductVariation, "id">[]
  images?: string[]
}

export interface CreateProductResponse {
  success: boolean
  data: {
    product: Product
  }
  message: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  shortDescription?: string
  category?: string
  price?: number
  comparePrice?: number
  cost?: number
  sku?: string
  barcode?: string
  weight?: number
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  variations?: Omit<ProductVariation, "id">[]
  images?: string[]
}

export interface UpdateProductResponse {
  success: boolean
  data: {
    product: Product
  }
  message: string
}

export interface GetProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  message: string
}

export interface GetProductResponse {
  success: boolean
  data: {
    product: Product
  }
  message: string
}

export interface DeleteProductResponse {
  success: boolean
  message: string
}

export interface UpdateStockRequest {
  stock: number
}

export interface UpdateStockResponse {
  success: boolean
  data: {
    product: Product
  }
  message: string
}

export interface BulkUpdateVariationsRequest {
  variations: ProductVariation[]
}

export interface BulkUpdateVariationsResponse {
  success: boolean
  data: {
    product: Product
  }
  message: string
}

export interface UploadImagesResponse {
  success: boolean
  data: {
    images: string[]
  }
  message: string
}

export interface DeleteImageResponse {
  success: boolean
  message: string
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  isFeatured?: boolean
  sortBy?: "name" | "price" | "createdAt" | "updatedAt"
  sortOrder?: "asc" | "desc"
}
