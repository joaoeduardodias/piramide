import { api } from "./api-client";


interface UpdateCategoryRequest {
  name: string,
  slug: string,
  id: string
}

export async function updateCategory({ id, name, slug }: UpdateCategoryRequest) {
  const result = await api.put(`categories/${id}`, { json: { name, slug } })
  return result
}