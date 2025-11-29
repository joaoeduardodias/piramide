import logoImg from '@/assets/logo.png';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { SignUpForm } from "./components/sign-up-form";


export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={32}
            height={32}
            unoptimized
            className='h-8 w-8'
          />
        </div>
        <CardTitle className="text-2xl text-center">Criar nova conta</CardTitle>
        <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
      </CardHeader>
      <SignUpForm />
    </Card>
  )
}
