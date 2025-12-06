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
    fileKey: string;
    sortOrder: number;
  }[];
  variants: {
    id: string;
    sku: string;
    price: number | null;
    comparePrice: number | null;
    stock: number;
    optionValues: {
      id: string;
      optionValueId: string;
    }[];
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
  categories: {
    category: {
      slug: string;
      id: string;
      name: string;
    };
  }[];
}

interface GetProductBySlugResponse {
  product: ProductDetails
}
interface GetProductRequest {
  slug: string
}

export async function getProductBySlug({ slug }: GetProductRequest) {
  const result = await api.get(`product/${slug}`, { next: { tags: [`product-${slug}`] }, headers: { "X-Skip-Auth": "true" } }).json<GetProductBySlugResponse>()
  return result
}