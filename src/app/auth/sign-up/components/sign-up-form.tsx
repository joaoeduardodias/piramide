"use client"
import googleIcon from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import { AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { signInWithGoogle } from "../../actions";
import { signUpAction } from "../actions";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(signUpAction)
  console.log(errors);

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {
          success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao Criar Usuário</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )
        }
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            name="name"
            placeholder="João Silva"
            disabled={isPending}
            className={errors?.name ? "border-red-500" : ""}
          />
          {errors?.name && <p className="text-xs text-red-500">{errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            disabled={isPending}
            className={errors?.email ? "border-red-500" : ""}

          />
          {errors?.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              className={errors?.password ? "border-red-500" : ""}

            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isPending}
            >
              {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>
          {errors?.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
          <p className="text-xs text-gray-500">Mínimo 6 caracteres, incluindo maiúsculas, minúsculas e números</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirmation">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isPending}
              className={errors?.passwordConfirmation ? "border-red-500" : ""}

            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isPending}
            >
              {showConfirmPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>
          {errors?.passwordConfirmation && <p className="text-xs text-red-500">{errors.passwordConfirmation[0]}</p>}
        </div>


      </CardContent>
      <CardFooter className="mt-4 flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
        <Button type="button" onClick={signInWithGoogle} variant="outline" className="w-full cursor-pointer" disabled={isPending}>
          <Image src={googleIcon} alt="" className="size-4" />
          Criar conta com Google
        </Button>
        <div className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/auth/sign-in" className="text-blue-600 hover:underline font-medium">
            Fazer login
          </Link>
        </div>
      </CardFooter>
    </form>
  )
}