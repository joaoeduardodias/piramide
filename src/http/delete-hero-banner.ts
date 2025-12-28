import { api } from "./api-client";


interface DeleteHeroBannerRequest {
  id: string
}

export async function deleteHeroBanner({ id }: DeleteHeroBannerRequest) {
  const result = await api.delete(`hero-slides/${id}`)
  return result
}