import { getProfile } from '@/http/get-profile';
import { defineAbilityFor } from '@/permissions/ability';
import { type JwtPayload } from 'jwt-decode';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface JWTDecode extends JwtPayload {
  role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'USER'
}

export async function isAuthenticated() {
  return !!(await cookies()).get('token')?.value
}
// export async function isAdmin() {
//   const token = (await cookies()).get('token')?.value
//   if (!token) return false
//   const { role } = jwtDecode<JWTDecode>(token)
//   return !!(role === 'ADMIN')
// }
// export async function isManager() {
//   const token = (await cookies()).get('token')?.value
//   if (!token) return false
//   const { role } = jwtDecode<JWTDecode>(token)
//   return !!(role === 'MANAGER')
// }
// export async function isEditor() {
//   const token = (await cookies()).get('token')?.value
//   if (!token) return false
//   const { role } = jwtDecode<JWTDecode>(token)
//   return !!(role === 'EDITOR')
// }

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
  const token = (await cookies()).get('token')?.value
  if (!token) {
    redirect("/auth/sign-in")
  }
  try {
    const { user } = await getProfile()
    return { user }
  } catch { }
  redirect("/api/auth/sign-out")
}