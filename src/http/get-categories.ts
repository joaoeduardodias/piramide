import { api } from "./api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  products: {
    id: string;
    name: string;
    image: string;
  }[];
}

interface GetCategories {
  categories: Category[]
}

export async function getCategories() {
  const result = await api.get('categories', { next: { tags: ['categories'] } }).json<GetCategories>()
  return result
}