import type {
  BulkUpdateVariationsRequest,
  BulkUpdateVariationsResponse,
  CreateProductRequest,
  CreateProductResponse,
  DeleteProductResponse,
  GetProductResponse,
  GetProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  UpdateStockRequest,
  UpdateStockResponse,
} from "@/types/product"
import { apiDelete, apiGet, apiPatch, apiPost, apiPostFormData, apiPut } from "../api"

export const productsService = {
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }): Promise<GetProductsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)

    const queryString = searchParams.toString()
    const endpoint = queryString ? `/products?${queryString}` : "/products"

    return apiGet<GetProductsResponse>(endpoint, {
      tags: ["products"], // Next.js 15: tag para revalidação
      revalidate: 60, // Revalidar a cada 60 segundos
    })
  },

  async getProduct(id: string): Promise<GetProductResponse> {
    return apiGet<GetProductResponse>(`/products/${id}`, {
      tags: ["products", `product-${id}`],
      revalidate: 60,
    })
  },

  async createProduct(data: CreateProductRequest): Promise<CreateProductResponse> {
    return apiPost<CreateProductResponse>("/products", data)
  },

  async updateProduct(id: string, data: UpdateProductRequest): Promise<UpdateProductResponse> {
    return apiPut<UpdateProductResponse>(`/products/${id}`, data)
  },

  async deleteProduct(id: string): Promise<DeleteProductResponse> {
    return apiDelete<DeleteProductResponse>(`/products/${id}`)
  },

  async updateStock(productId: string, variationId: string, data: UpdateStockRequest): Promise<UpdateStockResponse> {
    return apiPatch<UpdateStockResponse>(`/products/${productId}/variations/${variationId}/stock`, data)
  },

  async bulkUpdateVariations(
    productId: string,
    data: BulkUpdateVariationsRequest,
  ): Promise<BulkUpdateVariationsResponse> {
    return apiPatch<BulkUpdateVariationsResponse>(`/products/${productId}/variations`, data)
  },

  async uploadImages(productId: string, files: File[]): Promise<{ success: boolean; images: string[] }> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })

    return apiPostFormData<{ success: boolean; images: string[] }>(`/products/${productId}/images`, formData)
  },

  async deleteImage(productId: string, imageUrl: string): Promise<{ success: boolean; message: string }> {
    return apiDelete<{ success: boolean; message: string }>(`/products/${productId}/images`, {
      body: JSON.stringify({ imageUrl }),
    })
  },
}
