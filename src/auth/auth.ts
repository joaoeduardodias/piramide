import { getProfile } from '@/http/get-profile';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

interface JWTDecode extends JwtPayload {
  role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'USER'
}

export async function isAuthenticated() {
  return !!(await cookies()).get('token')?.value
}
export async function isAdmin() {
  const token = (await cookies()).get('token')?.value
  if (!token) return false
  const { role } = jwtDecode<JWTDecode>(token)
  return !!(role === 'ADMIN')
}
export async function isManager() {
  const token = (await cookies()).get('token')?.value
  if (!token) return false
  const { role } = jwtDecode<JWTDecode>(token)
  return !!(role === 'MANAGER')
}
export async function isEditor() {
  const token = (await cookies()).get('token')?.value
  if (!token) return false
  const { role } = jwtDecode<JWTDecode>(token)
  return !!(role === 'EDITOR')
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