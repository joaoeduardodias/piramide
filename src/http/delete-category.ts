import { api } from "./api-client";


interface DeleteCategoryRequest {
  id: string
}

export async function deleteCategory({ id }: DeleteCategoryRequest) {
  const result = await api.delete(`categories/${id}`)
  return result
}