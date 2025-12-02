import { api } from "./api-client";


interface getAddressesByUser {
  addresses: {
    id: string;
    name: string;
    number: string | null;
    street: string;
    complement: string | null;
    district: string | null;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }[]
}

export async function getAddressesByUser() {
  const result = await api.get('user/addresses', { next: { tags: ['addresses'] } }).json<getAddressesByUser>()
  return result
}