import logoImg from '@/assets/logo.png'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { FormSignIn } from "./components/form-sign-in"


export default async function SignInPage() {

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className='flex mx-auto'>
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={30}
            height={30}
            className='h-8 w-auto mt-1'
          />
        </div>
        <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
      </CardHeader>
      <FormSignIn />
    </Card>
  )
}