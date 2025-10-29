import { api } from "./api-client";


interface DeleteBrandRequest {
  id: string
}

export async function deleteBrand({ id }: DeleteBrandRequest) {
  const result = await api.delete(`brand/${id}`)
  return result
}