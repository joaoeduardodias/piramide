import { type JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

interface JWTDecode extends JwtPayload {
  role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'USER'
}

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = "/auth/sign-in"
  const cookiesStore = await cookies()
  cookiesStore.delete('token')
  return NextResponse.redirect(redirectUrl)

}

