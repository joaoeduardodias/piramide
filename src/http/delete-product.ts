import { api } from "./api-client";



interface DeleteProductRequest {
  id: string
}

export async function deleteProduct({ id }: DeleteProductRequest) {
  const result = await api.delete(`products/${id}`)
  return result

}