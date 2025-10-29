import { api } from "./api-client";

interface GetBrandByIdResponse {
  brand: {
    id: string;
    name: string;
    slug: string;
    products: {
      id: string;
      name: string;
    }[];
  }
}

interface GetBrandByIdRequest {
  id: string
}

export async function getBrandById({ id }: GetBrandByIdRequest) {
  const result = await api.get(`brand/${id}`).json<GetBrandByIdResponse>()
  return result

}