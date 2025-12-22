import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  products: {
    id: string;
    name: string;
    image: string;
  }[];
}


interface GetCategories {
  categories: Category[]
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
}

interface GetCategoriesParams {
  page?: number;
  limit?: number;
}

export async function getCategories(params?: GetCategoriesParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const url = `categories${query.toString() ? `?${query.toString()}` : ""}`;

  const result = await api.get(url, { next: { tags: ['categories'] } }).json<GetCategories>()
  return result
}

export function useCategories(params: GetCategoriesParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  })
}