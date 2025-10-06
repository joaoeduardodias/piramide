import { signInWithGoogle } from "@/http/sign-in-with-google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

interface JWTDecode extends JwtPayload {
  role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'USER'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "Github OAuth code was note found." }, { status: 400 })
  }
  const { token } = await signInWithGoogle({ code })

  const cookieStore = await cookies();
  cookieStore.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });

  const decodedToken = jwtDecode<JWTDecode>(token);
  const redirectUrl = request.nextUrl.clone()

  if (decodedToken && decodedToken.role === 'ADMIN' || decodedToken.role === 'MANAGER' || decodedToken.role === 'EDITOR') {
    redirectUrl.pathname = "/admin"
    redirectUrl.search = ''

  } else {
    redirectUrl.pathname = "/"
    redirectUrl.search = ''

  }

  return NextResponse.redirect(redirectUrl)

}

