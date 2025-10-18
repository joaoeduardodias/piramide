import { api } from "./api-client";


export interface GetProductByIdResponse {
  product: {
    id: string;
    name: string;
    slug: string;
    sales: number;
    featured: boolean | null;
    description: string | null;
    price: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: Date;
    updatedAt: Date;
    categories: {
      categoryId: string;
      productId: string;
      category: {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
    images: {
      id: string;
      url: string;
      alt: string | null;
      sortOrder: number;
      productId: string;
      fileKey: string;
      createdAt: Date;
      optionValueId: string | null;
    }[];
    variants: {
      id: string;
      price?: number;
      sku: string;
      stock: number;
      productId: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }
}
interface GetProductRequest {
  id: string
}

export async function getProductById({ id }: GetProductRequest) {

  const result = await api.get(`products/${id}`).json<GetProductByIdResponse>()

  return result

}