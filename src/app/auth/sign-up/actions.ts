"use server"

import { signUp } from "@/http/sign-up"
import type { Role } from "@/permissions/roles"
import { jwtDecode } from "jwt-decode"
import { HTTPError } from "ky"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import z from "zod/v4"

const signUpSchema = z
  .object({
    name: z.string().refine(
      (value) => value.trim().split(" ").length >= 2,
      "Por favor insira seu nome completo",
    ),
    email: z.string().email("Por favor, insira um email válido"),
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  let redirectTo: string | null = null

  try {
    const response = await signUp({ email, name, password })

    if (!response || typeof response.token !== "string") {
      console.error("signUp não retornou um token válido:", response)
      return {
        success: false,
        message: "Erro ao criar usuário. Token inválido.",
        errors: null,
      }
    }

    const token = response.token
    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    let decodedToken: {
      sub: string
      role: Role
      iat: number
      exp: number
    } | null = null

    try {
      decodedToken = jwtDecode(token)
    } catch (decodeErr) {
      console.error("Erro ao decodificar token:", decodeErr)
      return {
        success: false,
        message: "Erro ao decodificar token. Tente novamente.",
        errors: null,
      }
    }

    if (!decodedToken?.role) {
      return {
        success: false,
        message: "Token inválido retornado pelo servidor.",
        errors: null,
      }
    }


    if (["ADMIN", "MANAGER", "EDITOR"].includes(decodedToken.role)) {
      redirectTo = "/admin"
    } else {
      redirectTo = "/"
    }


  } catch (err: any) {
    console.error("Erro durante o signup:", err)

    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: "Erro encontrado. Por favor, tente novamente mais tarde.",
      errors: null,
    }
  }

  if (redirectTo) {
    redirect(redirectTo)
  }

  return { success: true, message: 'Erro encontrado', errors: null }
}
