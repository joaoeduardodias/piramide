import { api } from "./api-client";


export interface Product {

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