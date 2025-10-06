import { isAdmin, isAuthenticated } from "@/auth/auth"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { FormSignIn } from "./components/form-sign-in"

export default async function SignInPage() {
  if (await isAuthenticated() && await isAdmin()) {
    redirect('/admin')
  } else if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="size-12 rounded-md bg-black text-white flex items-center justify-center font-bold text-2xl">P</div>
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <FormSignIn />
      </Card>
    </div>
  )
}