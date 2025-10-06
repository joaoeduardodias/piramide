import { api } from "./api-client";


interface GetProfile {
  user: {
    id: string;
    name: string;
    email: string;
  }
}

export async function getProfile() {

  const result = await api.get('profile').json<GetProfile>()

  return result

}