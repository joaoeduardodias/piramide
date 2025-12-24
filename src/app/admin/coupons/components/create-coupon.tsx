"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useFormState } from "@/hooks/use-form-state"
import { queryClient } from "@/lib/query-client"
import { AlertTriangle, DollarSign, Loader2, Percent, Plus } from "lucide-react"
import { useState } from "react"
import { createCouponAction } from "../actions"

// export interface CreateCouponProps {
//   createDialogOpen: boolean
//   setCreateDialogOpen: (value: boolean) => void
// }


export function CreateCoupon() {
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT")
  const [isActive, setIsActive] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)


  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(createCouponAction,
    () => {
      setCreateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['coupons', { page: 1, limit: 10 }] })
    }
  )

  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Novo Cupom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Erro encontrado</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )
        }
        <DialogHeader>
          <DialogTitle>Criar Novo Cupom</DialogTitle>
          <DialogDescription>Preencha os dados do cupom de desconto</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="isActive" value={String(isActive)} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-code">Código do Cupom</Label>
              <Input
                id="create-code"
                name="code"
                placeholder="VERAO2024"
                required
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase()
                }}
                className="font-mono"
              />
              {errors?.code && (
                <p className="text-xs ml-1 text-red-600">{errors.code[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-type">Tipo de Desconto</Label>
                <Select value={type} defaultValue="PERCENT" onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger id="create-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">
                      <div className="flex items-center gap-2">
                        <Percent className="size-4" />
                        Percentual
                      </div>
                    </SelectItem>
                    <SelectItem value="FIXED">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4" />
                        Valor Fixo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors?.type && (
                  <p className="text-xs ml-1 text-red-600">{errors.type[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-value">Valor</Label>
                <Input
                  id="create-value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="20"
                  required
                />
                {errors?.value && (
                  <p className="text-xs ml-1 text-red-600">{errors.value[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-minOrderValue">Pedido Mínimo (R$)</Label>
                <Input
                  id="create-minOrderValue"
                  name="minOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100"
                />
                {errors?.minOrderValue && (
                  <p className="text-xs ml-1 text-red-600">{errors.minOrderValue[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-maxUses">Usos Máximos</Label>
                <Input id="create-maxUses" name="maxUses" type="number" min="1" placeholder="100" />
                {errors?.maxUses && (
                  <p className="text-xs ml-1 text-red-600">{errors.maxUses[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-expiresAt">Data de Expiração</Label>
              <Input id="create-expiresAt" name="expiresAt" type="date" />
              {errors?.expiresAt && (
                <p className="text-xs ml-1 text-red-600">{errors.expiresAt[0]}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="create-isActive" className="cursor-pointer">
                Cupom Ativo
              </Label>
              <Switch id="create-isActive" name="isActive" defaultChecked value="true" />
              {errors?.isActive && (
                <p className="text-xs ml-1 text-red-600">{errors.isActive[0]}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Cupom"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}