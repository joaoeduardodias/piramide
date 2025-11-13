import { getProfile } from '@/http/get-profile';
import { defineAbilityFor } from '@/permissions/ability';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';


export async function getToken(): Promise<string | undefined> {
  try {
    const cookiesStore = await cookies();
    return cookiesStore.get('token')?.value;
  } catch {
    return undefined;
  }
}


export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

export async function ability() {
  const { user } = await getProfile()
  if (!user) {
    return null
  }
  const ability = defineAbilityFor({
    __typename: "User",
    id: user.id,
    role: user.role
  })
  return ability
}

export async function auth() {
  const token = await getToken();

  if (!token) {
    redirect("/auth/sign-in");
  }

  try {
    const { user } = await getProfile();
    return { user };
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
  }

  redirect("/api/auth/sign-out");
}