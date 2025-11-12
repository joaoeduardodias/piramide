import logoImg from '@/assets/logo.png';
import { isAuthenticated } from "@/auth/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SignUpForm } from "./components/sign-up-form";
export default async function SignUpPage() {
  if (await isAuthenticated()) {
    redirect('/')
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={30}
            height={30}
          />
        </div>
        <CardTitle className="text-2xl text-center">Criar nova conta</CardTitle>
        <CardDescription className="text-center">Preencha os dados abaixo para criar sua conta</CardDescription>
      </CardHeader>
      <SignUpForm />
    </Card>
  )
}
