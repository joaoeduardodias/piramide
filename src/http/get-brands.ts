import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";


export interface Product {
  id: string;
  name: string;
}

interface GetBrands {
  brands: {
    products: Product[],
    id: string;
    name: string;
    slug: string;
  }[]
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
}

interface GetBrandsParams {
  page?: number;
  limit?: number;
}


export async function getBrands(params?: GetBrandsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const url = `brands${query.toString() ? `?${query.toString()}` : ""}`;
  const result = await api.get(url, { next: { tags: ['brands'] } }).json<GetBrands>()

  return result
}

export function useBrands(params: GetBrandsParams) {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => getBrands(params),
  })
}