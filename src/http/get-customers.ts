import { api } from "./api-client";

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
}

interface GetUserByRoleParams {
  role?: "ADMIN" | "MANAGER" | "EDITOR" | "CUSTOMER" | "GUEST"
}

interface GetCustomersResponse {
  users: User[]
}

export async function getUsersByRole(params?: GetUserByRoleParams) {
  const query = new URLSearchParams();

  if (params?.role) query.set("role", params.role);

  const url = `users?${query.toString()}`;
  const result = await api.get(url).json<GetCustomersResponse>()
  return result


}