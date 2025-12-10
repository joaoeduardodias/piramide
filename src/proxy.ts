import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";


const specialRoutes = [
  { path: '/auth/sign-in', whenAuthenticated: 'redirect' },
  { path: '/auth/sign-up', whenAuthenticated: 'redirect' },
  // { path: '/', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/auth/sign-in'
const PRIVATE_ROUTE_PREFIX = '/admin'

function isSpecialRoute(path: string): { found: boolean; route?: typeof specialRoutes[number] } {
  const route = specialRoutes.find(r => r.path === path)
  return route ? { found: true, route } : { found: false }
}

function isPrivateRoute(path: string): boolean {
  return path.startsWith(PRIVATE_ROUTE_PREFIX)
}

function isPublicRoute(path: string): boolean {
  if (isPrivateRoute(path)) {
    return false
  }
  return true
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token)

    if (!decoded.exp) {
      return false
    }
    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()

    return currentTime > expirationTime
  } catch (error) {
    console.error("Erro ao decodificar token:", error)
    return true
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const authToken = request.cookies.get('token')
  const { found: isSpecial, route: specialRoute } = isSpecialRoute(path)
  const isPrivate = isPrivateRoute(path)
  const isPublic = isPublicRoute(path)

  // Rota privada sem token
  if (isPrivate && !authToken) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  // Rota pública sem token
  if (isPublic && !authToken) {
    return NextResponse.next()
  }

  // Com token válido
  if (authToken) {
    // Validar se o token expirou
    if (isTokenExpired(authToken.value)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

      const response = NextResponse.redirect(redirectUrl)
      response.cookies.delete('token')

      return response
    }

    if (isSpecial && specialRoute?.whenAuthenticated === 'redirect') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }


  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)',
  ],
}