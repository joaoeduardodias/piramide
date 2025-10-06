import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória").min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.email("Email inválido").min(1, "Email é obrigatório"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const requestPasswordResetSchema = z.object({
  email: z.email("Email inválido").min(1, "Email é obrigatório"),
})

export const confirmPasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type RequestPasswordResetFormData = z.infer<typeof requestPasswordResetSchema>
export type ConfirmPasswordResetFormData = z.infer<typeof confirmPasswordResetSchema>
