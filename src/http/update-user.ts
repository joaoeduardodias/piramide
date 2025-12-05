import { api } from "./api-client";


interface UpdateUserRequest {
  name: string,
  phone?: string,
  cpf?: string
}

export async function UpdateUser({ cpf, name, phone }: UpdateUserRequest) {
  const result = await api.put(`user`, { json: { name, phone, cpf } })
  return result
}