import logoText from '@/assets/logo-piramide.svg'
import logoImg from '@/assets/logo.png'
import { isAuthenticated } from "@/auth/auth"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { redirect } from "next/navigation"
import { FormSignIn } from "./components/form-sign-in"


export default async function SignInPage() {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className='flex mx-auto'>
            <Image
              src={logoImg}
              alt="Pirâmide Calçados Logo"
              width={30}
              height={30}
              className='mt-1'
            />
            <Image
              src={logoText}
              alt="Pirâmide Calçados Logo Text"
              width={230}
              height={55}
            />
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <FormSignIn />
      </Card>
    </div>
  )
}