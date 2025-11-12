import logoImg from '@/assets/logo.png';
import { isAuthenticated } from '@/auth/auth';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from 'next/navigation';
import { FormRecoveryPassword } from "./components/form-recovery-password";


export default async function RecoveryPasswordPage() {
  if (await isAuthenticated()) {
    redirect('/')
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={30}
            height={30}
            className="h-8 w-auto"
          />
        </div>
        <CardTitle className="text-2xl text-center">Recuperar senha</CardTitle>
        <CardDescription className="text-center">
          Digite seu email para receber instruções de recuperação.
        </CardDescription>
      </CardHeader>
      <FormRecoveryPassword />
    </Card>
  )
}
