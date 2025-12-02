import { api } from "./api-client";

interface DeleteAddressRequest {
  id: string
}

export async function deleteAddress({ id }: DeleteAddressRequest) {
  const result = await api.delete(`addresses/${id}`)
  return result
}