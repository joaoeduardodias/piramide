"use server"

import { signUp } from "@/http/sign-up";
import { jwtDecode } from 'jwt-decode';
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod/v4";

const signUpSchema = z.object({
  name: z.string().refine(
    value => value.trim().split(' ').length >= 2,
    "Por favor insira seu nome completo"
  ),
  email: z.email("Por favor, insira um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
  ),
  passwordConfirmation: z.string()
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem",
  path: ["passwordConfirmation"],
})

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };


  const { name, email, password } = result.data
  let decodedToken: {
    sub: string;
    role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'CUSTOMER' | 'GUEST';
    iat: number;
    exp: number;
  }


  try {
    const { token } = await signUp({ email, name, password })

    const cookiesStore = await cookies()

    cookiesStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    decodedToken = jwtDecode(token);
  }
  catch (err: any) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null };
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null
    }
  }
  if (decodedToken && decodedToken.role === 'ADMIN' || decodedToken.role === 'MANAGER' || decodedToken.role === 'EDITOR') {
    redirect("/admin")
  } else {
    redirect("/")
  }
}
