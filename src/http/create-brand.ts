import { api } from "./api-client";


interface CreateBrandRequest {
  name: string,
  slug: string,
}
interface CreateBrandResponse {
  brandId: string
}

export async function createBrand({ name, slug }: CreateBrandRequest) {
  const result = await api.post('brand', { json: { name, slug } }).json<CreateBrandResponse>()
  return result
}