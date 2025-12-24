import { CouponsTable } from "./components/coupons-table"
import { CreateCoupon } from "./components/create-coupon"

export const metadata = {
  title: "Cupons | Dashboard",
  description: "Gerencie seus cupons de desconto",
}

export default function CouponPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cupons</h1>
          <p className="text-muted-foreground">
            Gerencie seus cupons de desconto
          </p>
        </div>
        <CreateCoupon />
      </div>
      <CouponsTable />
    </div>
  )
}
