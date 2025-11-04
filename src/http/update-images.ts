import { api } from "./api-client";


interface UpdateImagesRequest {
  productId: string
  images: {
    fileKey: string
    url: string
    sortOrder: number
  }[]
}

export async function updateImages({ productId, images }: UpdateImagesRequest) {
  const result = await api.put(`products/${productId}/images`, { json: { images } })
  return result
}