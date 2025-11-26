import { api } from "./api-client";


export interface Product {
  id: string;
  name: string;
}

interface GetBrands {
  brands: {
    products: Product[],
    id: string;
    name: string;
    slug: string;
  }[]
}

export async function getBrands() {
  // const result = await api.get('brands', {
  //   next: {
  //     tags: ['brands']
  //   }
  // }).json<GetBrands>()
  const result = await api.get('brands').json<GetBrands>()
  return result
}