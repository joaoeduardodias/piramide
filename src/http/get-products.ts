import { api } from "./api-client";


export interface Product {
  id: string;
  name: string;
  slug: string;
  featured: boolean | null;
  brand: {
    id: string;
    name: string;
  };
  description: string | null;
  price: number;
  comparePrice: number | null;
  sales: number;
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  images: {
    id: string;
    url: string;
    alt: string | null;
  }[];
  variants: {
    id: string;
    price: number | null;
    sku: string;
    stock: number;
  }[];
}

interface GetProducts {
  products: Product[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
}

export async function getProducts() {
  const result = await api.get('products').json<GetProducts>()
  return result

}