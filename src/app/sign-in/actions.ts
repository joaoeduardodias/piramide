"use server"

import { signInWithPassword } from "@/http/sign-in-with-password";
import { jwtDecode } from 'jwt-decode';
import { HTTPError } from "ky";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod/v4";

const signInSchema = z.object({
  email: z.email("Por favor, insira um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export async function signInAction(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors }
  };


  const { email, password } = result.data
  let decodedToken: {
    sub: string;
    role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'CUSTOMER' | 'GUEST';
    iat: number;
    exp: number;
  }


  try {
    const { token } = await signInWithPassword({ email, password });

    (await cookies()).set('token', token, {
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
