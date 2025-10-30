import { api } from "./api-client";


export interface ProductType {
  id: string;
  name: string;
  slug: string;
  featured: boolean | null;
  createdAt: string;
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
  products: ProductType[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
}


interface GetProductsParams {
  featured?: boolean;
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  categoryId?: string;
  search?: string;
}

export async function getProducts(params?: GetProductsParams) {
  const query = new URLSearchParams();
  if (params?.featured) query.set("featured", "true");
  else query.delete("featured");
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.search) query.set("search", params.search);

  const url = `products${query.toString() ? `?${query.toString()}` : ""}`;
  const result = await api.get(url).json<GetProducts>()
  return result

}