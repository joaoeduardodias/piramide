import { api } from "./api-client";


interface SetAddressDefaultRequest {
  id: string
}

export async function setAddressDefault({ id }: SetAddressDefaultRequest) {
  const result = await api.patch(`addresses/${id}/set-default`,)
  return result
}