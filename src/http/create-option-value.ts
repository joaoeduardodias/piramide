import { api } from "./api-client";

interface CreateOptionRequest {
  optionName: string,
  values: {
    content: string | null
    value: string
  }[]
}

export async function createOptionValue({ optionName, values }: CreateOptionRequest) {
  const result = await api.post('options/values', { json: { optionName, values } }).json()
  return result
}