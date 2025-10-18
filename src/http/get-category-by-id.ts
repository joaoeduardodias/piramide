import { api } from "./api-client";


interface GetCategoryByIdResponse {


}
interface GetCategoryByIdRequest {
  id: string
}

export async function getCategoryById({ id }: GetCategoryByIdRequest) {

  const result = await api.get(`categories/${id}`).json<GetCategoryByIdResponse>()
  return result

}