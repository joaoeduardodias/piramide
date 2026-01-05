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
import { queryClient } from "@/lib/query-client"
import { AlertTriangle, DollarSign, Edit, Loader2, Percent } from "lucide-react"
import { useEffect, useState } from "react"
import { updateCouponAction } from "../actions"
import { ProductsSelector } from "./products-selector"


interface UpdateCouponProps {
  coupon: Coupon
  updateDialogOpen: boolean
  selectedCoupon: Coupon | null
  setUpdateDialogOpen: (value: boolean) => void
  setSelectedCoupon: (coupon: Coupon | null) => void
}

export function UpdateCoupon({ setUpdateDialogOpen, updateDialogOpen, selectedCoupon, setSelectedCoupon, coupon }: UpdateCouponProps) {
  const [scope, setScope] = useState<"ALL_PRODUCTS" | "PRODUCTS">(
    coupon.scope
  )
  const [updateSelectedProducts, setUpdateSelectedProducts] = useState<string[]>(
    coupon.products?.map(p => p.id) ?? []
  )
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(updateCouponAction,
    () => {
      setUpdateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['coupons', { page: 1, limit: 10 }] })

    }
  )
  const [isActive, setIsActive] = useState(true)
  const [type, setType] = useState<"PERCENT" | "FIXED">(coupon.type)


  useEffect(() => {
    if (!open || !selectedCoupon) return

    setScope(coupon.scope)

    setUpdateSelectedProducts(
      selectedCoupon.products?.map(p => p.id) ?? []
    )
  }, [updateDialogOpen, selectedCoupon])


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
      <DialogContent className="max-h-[90vh] flex flex-col">
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
          <input type="hidden" name="couponId" value={coupon.id} />
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="type" value={type} />
          {updateSelectedProducts.map(productId => (
            <input
              key={productId}
              type="hidden"
              name="productIds"
              value={productId}
            />
          ))}
          <div className="space-y-4 py-4 overflow-y-auto pr-1">
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

            <div className="grid grid-cols-2 gap-4 w-full min-w-0">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo de Desconto</Label>
                <Select value={type} defaultValue={coupon.type} onValueChange={(v) => setType(v as any)}>

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
                  defaultValue={
                    coupon.type === "FIXED"
                      ? (coupon.value / 100)
                      : coupon.value
                  }
                  required
                />
                {errors?.value && (
                  <p className="text-xs ml-1 text-red-600">{errors.value[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-scope">Aplicar Cupom</Label>
                <Select
                  name="scope"
                  value={scope}
                  onValueChange={(v) => {
                    setScope(v as "ALL_PRODUCTS" | "PRODUCTS")
                    if (v === "ALL_PRODUCTS") {
                      setUpdateSelectedProducts([])
                    }
                  }}
                  required
                >
                  <SelectTrigger id="create-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_PRODUCTS">Todos os Produtos</SelectItem>
                    <SelectItem value="PRODUCTS">Produtos Específicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {scope === "PRODUCTS" && (
              <div className="border rounded-lg p-4 bg-muted/30 w-full min-w-0 overflow-hidden">
                <ProductsSelector
                  selectedProductIds={updateSelectedProducts}
                  onProductsChange={setUpdateSelectedProducts}
                />
                {errors?.productIds && (
                  <p className="text-xs ml-1 text-red-600">{errors.productIds[0]}</p>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 w-full min-w-0">
              <div className="space-y-2">
                <Label htmlFor="edit-minOrderValue">Pedido Mínimo (R$)</Label>
                <Input
                  id="edit-minOrderValue"
                  name="minOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    coupon.minOrderValue != null
                      ? (coupon.minOrderValue / 100)
                      : ""
                  }
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
              <input
                type="hidden"
                name="isActive"
                value={isActive ? "true" : "false"}
              />

              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
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