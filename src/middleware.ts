import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token");

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/admin", "/profile", "/dashboard"];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: [

    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
