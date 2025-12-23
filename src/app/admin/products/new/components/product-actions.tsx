"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ProductActionsProps {
  isPending: boolean
  onSubmit: () => Promise<void>
  error?: string
}

export function ProductActions({
  isPending,
  onSubmit,
  error,
}: ProductActionsProps) {
  return (
    <>
      <Button
        type="button"
        className="w-full"
        onClick={onSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex gap-2">
            Criando <Loader2 className="size-4 animate-spin" />
          </span>
        ) : (
          "Criar Produto"
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600 text-center mt-2">{error}</p>
      )}
    </>
  )
}
