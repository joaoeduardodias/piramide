import { api } from "./api-client";

interface CreateOptionRequest {
  name: string,
  values: {
    content: string | null
    value: string
  }[]
}
interface CreateOptionResponse {
  optionId: string
}

export async function createOption({ name, values }: CreateOptionRequest) {
  const result = await api.post('options', { json: { name, values } }).json<CreateOptionResponse>()
  return result
}