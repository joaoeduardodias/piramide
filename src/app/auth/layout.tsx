import { isAuthenticated } from "@/auth/auth"
import { redirect } from "next/navigation"
import type React from "react"


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated()
  if (isAuth) {
    redirect('/')
  }
  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {children}
    </div>
  )
}
