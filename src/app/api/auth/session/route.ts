import { auth } from "@/auth/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookiesStore = await cookies()
  const token = cookiesStore.get("token")?.value

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, isAdmin: false })
  }

  const { user } = await auth()
  return NextResponse.json({
    isAuthenticated: true,
    isAdmin: user?.role === "ADMIN",
  })
}
