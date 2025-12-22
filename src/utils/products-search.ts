import type { GetProductsParams } from "@/http/get-products"

export function productsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): GetProductsParams {
  return {
    featured: sp.featured === "true" ? true : undefined,
    page: sp.page ? Number(sp.page) : 1,
    limit: sp.limit ? Number(sp.limit) : 50,
    status: typeof sp.status === "string" ? sp.status as any : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    brand: typeof sp.brand === "string" ? sp.brand : undefined,
    search: typeof sp.search === "string" ? sp.search : undefined,
    sortBy: typeof sp.sortBy === "string" ? sp.sortBy as any : "relevance",
    optionValues:
      typeof sp.optionValues === "string"
        ? sp.optionValues.split(",")
        : Array.isArray(sp.optionValues)
          ? sp.optionValues.flatMap(v => v.split(","))
          : undefined,
  }
}
