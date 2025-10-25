import { api } from "./api-client";


interface GetCategoryByIdResponse {
  category: {
    id: string;
    name: string;
    slug: string;
    products: {
      product: {
        id: string;
        name: string;
      };
    }[];
  }

}
interface GetCategoryByIdRequest {
  id: string
}

export async function getCategoryById({ id }: GetCategoryByIdRequest) {

  const result = await api.get(`categories/${id}`).json<GetCategoryByIdResponse>()
  return result

}