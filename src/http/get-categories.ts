import { api } from "./api-client";

export interface Category {
  id: string,
  name: string,
  slug: string,
  products: {
    product: {
      id: string;
      name: string;
    };
  }[];
}

interface GetCategories {
  categories: Category[]
}

export async function getCategories() {
  const result = await api.get('categories').json<GetCategories>()
  return result
}