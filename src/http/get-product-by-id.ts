import { api } from "./api-client";


export interface GetProductByIdResponse {
  product: {
    id: string;
    name: string;
    description: string | null;
    featured: boolean;
    price: number;
    comparePrice: number | null;
    weight: number | null;
    brand: {
      id: string;
      name: string;
    }
    images: {
      id: string;
      url: string;
      alt: string | null;
      fileKey: string | null;
      sortOrder: number;
    }[];
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
interface GetProductRequest {
  id: string
}

export async function getProductById({ id }: GetProductRequest) {
  const result = await api.get(`products/${id}`, { next: { tags: [`product-${id}`] } }).json<GetProductByIdResponse>()
  return result
}