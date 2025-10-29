import { api } from "./api-client";


interface UpdateBrandRequest {
  name: string,
  slug: string,
  id: string
}

export async function updateBrand({ id, name, slug }: UpdateBrandRequest) {
  const result = await api.put(`brand/${id}`, { json: { name, slug } })
  return result
}