"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  confirmPasswordResetSchema,
  requestPasswordResetSchema,
  type ConfirmPasswordResetFormData,
  type RequestPasswordResetFormData,
} from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function RecoveryPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const isResetMode = !!token
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const requestForm = useForm<RequestPasswordResetFormData>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  })

  const confirmForm = useForm<ConfirmPasswordResetFormData>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // const onRequestReset = async (data: RequestPasswordResetFormData) => {
  //   try {
  //     if (response.success) {
  //       setIsSuccess(true)
  //       toast('Email enviado!', {
  //         description: "Verifique sua caixa de entrada para redefinir sua senha.",
  //       })
  //     }
  //   } catch (error: any) {
  //     toast('Erro ao enviar email', {
  //       description: error.response?.data?.message || "Não foi possível enviar o email. Tente novamente.",

  //     })
  //   }
  // }

  // const onConfirmReset = async (data: ConfirmPasswordResetFormData) => {
  //   try {
  //     const response = await authService.confirmPasswordReset({
  //       token: token!,
  //       ...data,
  //     })

  //     if (response.success) {
  //       setIsSuccess(true)
  //       toast('Senha redefinida!', {
  //         description: "Sua senha foi alterada com sucesso.",
  //       })
  //     }
  //   } catch (error: any) {
  //     toast('Erro ao redefinir senha', {
  //       description: error.response?.data?.message || "Não foi possível redefinir sua senha. Tente novamente.",
  //     })
  //   }
  // }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle2 className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isResetMode ? "Senha redefinida!" : "Email enviado!"}
            </CardTitle>
            <CardDescription className="text-center">
              {isResetMode
                ? "Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha."
                : "Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e spam."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/auth/sign-in" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="mr-2 size-4" />
                Voltar para login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="size-12 rounded-md bg-black text-white flex items-center justify-center font-bold text-2xl">P</div>
          </div>
          <CardTitle className="text-2xl text-center">{isResetMode ? "Redefinir senha" : "Recuperar senha"}</CardTitle>
          <CardDescription className="text-center">
            {isResetMode ? "Digite sua nova senha abaixo" : "Digite seu email para receber instruções de recuperação."}
          </CardDescription>
        </CardHeader>
        {!isResetMode ? (
          <form className="space-y-4"
          // onSubmit={requestForm.handleSubmit(onRequestReset)}
          >
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={requestForm.formState.isSubmitting}
                  className={requestForm.formState.errors.email ? "border-red-500" : ""}
                  {...requestForm.register("email")}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={requestForm.formState.isSubmitting}>
                {requestForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar instruções"
                )}
              </Button>
              <Link
                href="/auth/sign-in"
                className="text-center text-sm text-blue-600 hover:underline w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Voltar para login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <form
          // onSubmit={confirmForm.handleSubmit(onConfirmReset)}
          >
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={confirmForm.formState.isSubmitting}
                    className={confirmForm.formState.errors.password ? "border-red-500" : ""}
                    {...confirmForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={confirmForm.formState.isSubmitting}
                  >
                    {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                </div>
                {confirmForm.formState.errors.password && (
                  <p className="text-sm text-red-500">{confirmForm.formState.errors.password.message}</p>
                )}
                <p className="text-xs text-gray-500">Mínimo 6 caracteres, incluindo maiúsculas, minúsculas e números</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={confirmForm.formState.isSubmitting}
                    className={confirmForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                    {...confirmForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={confirmForm.formState.isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{confirmForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={confirmForm.formState.isSubmitting}>
                {confirmForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </Button>
              <Link
                href="/auth/sign-in"
                className="text-center text-sm text-blue-600 hover:underline w-full flex items-center justify-center gap-2"
              >
                {/* <ArrowLeft className="size-4" /> */}
                Voltar para login
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
