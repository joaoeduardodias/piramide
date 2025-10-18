import { api } from "./api-client";


interface GetCategories {
  categories: {
    id: string,
    name: string,
    slug: string,
    products: {
      product: {
        id: string;
        name: string;
      };
    }[];
  }[]
}

export async function getCategories() {
  const result = await api.get('categories').json<GetCategories>()
  return result
}