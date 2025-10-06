import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { cookies } from "next/headers";

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