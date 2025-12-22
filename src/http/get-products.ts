import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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


export interface GetProductsParams {
  featured?: boolean;
  page?: number;
  limit?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: string;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "relevance" | "created-desc";
  brand?: string;
  optionValues?: string[];
}
export async function getProducts(params?: GetProductsParams) {
  const query = new URLSearchParams();
  if (params?.featured) query.set("featured", "true");
  else query.delete("featured");
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.brand) query.set("brand", params.brand);
  if (params?.optionValues && params.optionValues.length > 0) {
    query.set("optionValues", params.optionValues.join(","));
  }
  const url = `products${query.toString() ? `?${query.toString()}` : ""}`;
  const result = await api.get(url, { next: { tags: ['products'] }, headers: { "X-Skip-Auth": "true" } }).json<GetProducts>()
  return result
}

export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
}

export function useInfiniteProducts(params: GetProductsParams) {
  return useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { products, pagination } = await getProducts({ ...params, page: pageParam, limit: params.limit ?? 20 })

      return { products, pagination }
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
  })
}