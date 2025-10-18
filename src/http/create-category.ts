import { api } from "./api-client";


interface CreateCategoryRequest {
  name: string,
  slug: string,
}
interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory({ name, slug }: CreateCategoryRequest) {
  const result = await api.post('categories', { json: { name, slug } }).json<CreateCategoryResponse>()
  return result
}