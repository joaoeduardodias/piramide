import { api } from "./api-client";


interface GetOptions {
  options: {
    name: string;
    id: string;
    values: {
      id: string;
      value: string;
      content: string | null;
    }[];
  }[]
}

export async function getOptions() {

  const result = await api.get('options', { next: { tags: ['options'] } }).json<GetOptions>()

  return result

}