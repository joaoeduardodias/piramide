import type { Role } from "@/permissions/roles";
import { api } from "./api-client";


interface GetProfile {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role
    cpf: string | null;
    phone: string | null;
  }
}

export async function getProfile() {
  const result = await api.get('profile', { next: { tags: ['profile'] } }).json<GetProfile>()
  return result
}