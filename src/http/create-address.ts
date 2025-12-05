import { api } from "./api-client";

interface CreateAddressRequest {
  street: string
  complement?: string | null
  number?: string | null
  district: string
  city: string
  state: string
  postalCode: string
  isDefault: boolean
  name: string
}
interface CreateAddressResponse {
  addressId: string
}

export async function createAddress({ city, complement, district, isDefault, name, number, postalCode, state, street }: CreateAddressRequest) {
  const result = await api.post('address', { json: { city, complement, district, isDefault, name, number, postalCode, state, street } }).json<CreateAddressResponse>()
  return result
}