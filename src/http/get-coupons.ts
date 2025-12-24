import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";

export type CouponType = 'PERCENT' | 'FIXED'

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  usedCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  minOrderValue: number | null
}


interface GetCoupons {
  coupons: Coupon[]
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  },
}

interface GetCouponsParams {
  page?: number;
  limit?: number;
}

export async function getCoupons(params?: GetCouponsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const url = `coupons${query.toString() ? `?${query.toString()}` : ""}`;

  const result = await api.get(url, { next: { tags: ['coupons'] } }).json<GetCoupons>()
  return result
}

export function useCoupons(params: GetCouponsParams) {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => getCoupons(params),
  })
}