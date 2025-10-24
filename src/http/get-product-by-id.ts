import { api } from "./api-client";


export interface GetProductByIdResponse {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number
    weight: number | null;
    variants: {
      id: string;
      price: number | null;
      sku: string;
      stock: number;
      comparePrice: number | null;
    }[];
    productOptions: {
      option: {
        id: string;
        name: string;
        values: {
          value: string;
          content: string | null;
        }[];
      };
    }[];
    images: {
      id: string;
      url: string;
      alt: string | null;
      fileKey: string | null;
      sortOrder: number;
    }[];
    comparePrice: number | null;
    featured: boolean | null;
  }
}
interface GetProductRequest {
  id: string
}

export async function getProductById({ id }: GetProductRequest) {

  const result = await api.get(`products/${id}`).json<GetProductByIdResponse>()

  return result

}