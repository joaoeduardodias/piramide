import { api } from "./api-client";


export interface GetProductBySlugResponse {
  product: {
    id: string;
    name: string;
    description: string | null;
    featured: boolean;
    price: number;
    comparePrice: number | null;
    weight: number | null;
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
  slug: string
}

export async function getProductBySlug({ slug }: GetProductRequest) {

  const result = await api.get(`product/${slug}`).json<GetProductBySlugResponse>()

  return result

}