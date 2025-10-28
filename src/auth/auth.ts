import { getProfile } from '@/http/get-profile';
import { defineAbilityFor } from '@/permissions/ability';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

// interface JWTDecode extends JwtPayload {
//   role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'USER'
// }

export async function isAuthenticated() {
  const cookiesStore = await cookies()
  return !!cookiesStore.get('token')?.value
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
  const cookiesStore = await cookies()
  const token = cookiesStore.get('token')?.value
  if (!token) {
    redirect("/auth/sign-in")
  }
  try {
    const { user } = await getProfile()
    return { user }
  } catch { }
  redirect("/api/auth/sign-out")
}