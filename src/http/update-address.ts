import { api } from "./api-client";


interface UpdateAddressRequest {
  street: string
  complement?: string | null
  number?: string | null
  district: string
  city: string
  state: string
  postalCode: string
  isDefault: boolean
  name: string
  id: string
}

export async function updateAddress({ id, name, city, district, isDefault, postalCode, state, street, complement, number }: UpdateAddressRequest) {
  const result = await api.put(`address/${id}`, { json: { name, city, district, isDefault, postalCode, state, street, complement, number } })
  return result
}