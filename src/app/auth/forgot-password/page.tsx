import logoImg from '@/assets/logo.png';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FormForgotPassword } from './components/form-forgot-password';

export default function ForgotPasswordPage() {

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={30}
            height={30}
            unoptimized
            className="h-8 w-8"
          />
        </div>
        <CardTitle className="text-2xl text-center">Esqueci minha senha</CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber instruções de recuperação.
        </CardDescription>
      </CardHeader>
      <FormForgotPassword />
    </Card>
  )
}
