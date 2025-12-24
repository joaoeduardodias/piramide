"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useFormState } from "@/hooks/use-form-state"
import type { Coupon } from "@/http/get-coupons"
import { AlertTriangle, DollarSign, Edit, Loader2, Percent } from "lucide-react"
import { updateCouponAction } from "../actions"


interface UpdateCouponProps {
  coupon: Coupon
  updateDialogOpen: boolean
  selectedCoupon: Coupon | null
  setUpdateDialogOpen: (value: boolean) => void
  setSelectedCoupon: (coupon: Coupon | null) => void
}

export function UpdateCoupon({ setUpdateDialogOpen, updateDialogOpen, selectedCoupon, setSelectedCoupon, coupon }: UpdateCouponProps) {

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateCouponAction,
    () => {
      setUpdateDialogOpen(false)
    }
  )


  return (
    <Dialog
      open={updateDialogOpen && selectedCoupon?.id === coupon.id}
      onOpenChange={(open) => {
        setUpdateDialogOpen(open)
        if (!open) setSelectedCoupon(null)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setSelectedCoupon(coupon)}>
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle>Editar Cupom - {coupon.code}</DialogTitle>
          <DialogDescription>Altere as informações do cupom</DialogDescription>
        </DialogHeader>
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
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="couponId" value={coupon.id} />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código do Cupom</Label>
              <Input
                id="edit-code"
                name="code"
                defaultValue={coupon.code}
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
                <Label htmlFor="edit-type">Tipo de Desconto</Label>
                <Select name="type" defaultValue={coupon.type} required>
                  <SelectTrigger id="edit-type">
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
                <Label htmlFor="edit-value">Valor</Label>
                <Input
                  id="edit-value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={coupon.value}
                  required
                />
                {errors?.value && (
                  <p className="text-xs ml-1 text-red-600">{errors.value[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minOrderValue">Pedido Mínimo (R$)</Label>
                <Input
                  id="edit-minOrderValue"
                  name="minOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={coupon.minOrderValue ?? ""}
                />
                {errors?.minOrderValue && (
                  <p className="text-xs ml-1 text-red-600">{errors.minOrderValue[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maxUses">Usos Máximos</Label>
                <Input
                  id="edit-maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  defaultValue={coupon.maxUses ?? ""}
                />
                {errors?.maxUses && (
                  <p className="text-xs ml-1 text-red-600">{errors.maxUses[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-expiresAt">Data de Expiração</Label>
              <Input
                id="edit-expiresAt"
                name="expiresAt"
                type="date"
                defaultValue={
                  coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : ""
                }
              />
              {errors?.expiresAt && (
                <p className="text-xs ml-1 text-red-600">{errors.expiresAt[0]}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label htmlFor="edit-isActive" className="cursor-pointer">
                Cupom Ativo
              </Label>
              <Switch
                id="edit-isActive"
                name="isActive"
                defaultChecked={coupon.isActive}
                value="true"
              />
              {errors?.isActive && (
                <p className="text-xs ml-1 text-red-600">{errors.isActive[0]}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}