import { z } from "zod"

export const variationSchema = z.object({
  color: z.string().min(1, "Cor é obrigatória"),
  size: z.string().min(1, "Tamanho é obrigatório"),
  sku: z.string().min(1, "SKU é obrigatório"),
  quantity: z.coerce.number().min(0, "Quantidade não pode ser negativa").int("Quantidade deve ser um número inteiro"),
})

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do produto é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(5000, "Descrição deve ter no máximo 5000 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero").positive("Preço deve ser positivo"),
  colors: z.array(z.string()).min(1, "Selecione pelo menos uma cor"),
  sizes: z.array(z.string()).min(1, "Selecione pelo menos um tamanho"),
  variations: z.array(variationSchema).min(1, "Adicione pelo menos uma variação com quantidade"),
  images: z.array(z.instanceof(File)).optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
export type VariationFormData = z.infer<typeof variationSchema>
