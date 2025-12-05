"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useFormState } from "@/hooks/use-form-state"
import { formatCpf } from "@/utils/format-cpf"
import { formatPhone } from "@/utils/format-phone"
import { AlertTriangle, Check, Loader2, Mail, User } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import { updateUserAction } from "./actions"

interface ProfileFormProps {
  initialCpf: string
  initialPhone: string
  userName: string
  userEmail: string
}

export function ProfileForm({ initialCpf, initialPhone, userName, userEmail }: ProfileFormProps) {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    updateUserAction,
    () => {
      toast.success("Perfil atualizado!")
    },
  )

  const [cpf, setCpf] = useState(() => formatCpf(initialCpf ?? ""))
  const [phone, setPhone] = useState(() => formatPhone(initialPhone ?? ""))

  function onChangeCpf(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setCpf(formatCpf(raw))
  }

  function onChangePhone(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setPhone(formatPhone(raw))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro encontrado</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="name" name="name" placeholder="Seu nome completo" defaultValue={userName} className="pl-10" />
        </div>
        {errors?.name && <p className="text-xs ml-1 text-red-600">{errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground">Email</Label>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{userEmail}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={onChangeCpf}
          className="font-mono"
        />
        {errors?.cpf && <p className="text-xs ml-1 text-red-600">{errors.cpf[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={phone}
          onChange={onChangePhone}
          className="font-mono"
        />
        {errors?.phone && <p className="text-xs ml-1 text-red-600">{errors.phone[0]}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Salvar Alterações
          </>
        )}
      </Button>
    </form>
  )
}
