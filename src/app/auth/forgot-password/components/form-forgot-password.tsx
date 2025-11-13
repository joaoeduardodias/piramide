"use client"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function FormForgotPassword() {

  return (
    <form className="space-y-3">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Digite seu e-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="Seu email"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full">
          Enviar Email
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
  )
}