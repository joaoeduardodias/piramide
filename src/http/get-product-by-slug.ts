import { api } from "./api-client";


export interface ProductDetails {
  id: string;
  name: string;
  description: string | null;
  featured: boolean;
  price: number;
  comparePrice: number | null;
  weight: number | null;
  brand: string;
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
    optionValues: {
      id: string;
      optionValueId: string;
    }[];
  }[];
  categories: {
    category: {
      slug: string;
      id: string;
      name: string;
    };
  }[];
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

interface GetProductBySlugResponse {
  product: ProductDetails
}
interface GetProductRequest {
  slug: string
}

export async function getProductBySlug({ slug }: GetProductRequest) {
  const result = await api.get(`product/${slug}`, { next: { tags: [`product-${slug}`] } }).json<GetProductBySlugResponse>()
  return result

}