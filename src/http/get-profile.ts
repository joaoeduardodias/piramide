import type { Role } from "@/permissions/roles";
import { api } from "./api-client";


interface GetProfile {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfile>()
  return result
}