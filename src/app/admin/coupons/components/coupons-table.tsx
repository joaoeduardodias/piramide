"use client"

import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCoupons, type Coupon } from "@/http/get-coupons"
import { formatReal } from "@/lib/validations"
import { Calendar, DollarSign, Percent, Tag, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { updateStatusCouponAction } from "../actions"
import { DeleteCoupon } from "./delete-coupon"
import { UpdateCoupon } from "./update-coupon"

export function CouponsTable() {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 10)

  const { data, isLoading } = useCoupons({ page, limit })

  function updatePage(next: Partial<{ page: number; limit: number }>) {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`?${params.toString()}`, { scroll: false })
  }


  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  async function handleToggleStatus(couponId: string) {
    await updateStatusCouponAction(couponId)
  }



  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-10 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="rounded-lg border ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data!.pagination.total === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum cupom encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data!.coupons.map((coupon) => {
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="size-4 text-muted-foreground" />
                          <span className="font-mono font-semibold">{coupon.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {coupon.type === "PERCENT" ? (
                            <div className="flex items-center gap-1">
                              <Percent className="size-3" />
                              Percentual
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <DollarSign className="size-3" />
                              Fixo
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {coupon.type === "PERCENT" ? `${coupon.value}%` : formatReal(String(coupon.value))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="size-4 text-muted-foreground" />
                          {coupon.usedCount}
                          {coupon.maxUses && ` / ${coupon.maxUses}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.expiresAt ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="size-4 text-muted-foreground" />
                            {formatDate(coupon.expiresAt)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sem expiração</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={coupon.isActive} onCheckedChange={() => handleToggleStatus(coupon.id)} />
                          <Badge variant={coupon.isActive ? "default" : "secondary"}>
                            {coupon.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <UpdateCoupon
                            coupon={coupon}
                            selectedCoupon={selectedCoupon}
                            setUpdateDialogOpen={setUpdateDialogOpen}
                            updateDialogOpen={updateDialogOpen}
                            setSelectedCoupon={setSelectedCoupon}

                          />

                          <DeleteCoupon
                            couponId={coupon.id}

                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          page={data!.pagination.page}
          itemsPerPage={data!.pagination.limit}
          totalPages={data!.pagination.totalPages}
          setPage={(p) => updatePage({ page: p })}
          setItemsPerPage={(l) =>
            updatePage({ limit: l, page: 1 })
          }
        />

      </CardContent>
    </Card>
  )
}
