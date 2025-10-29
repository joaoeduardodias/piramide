import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createBrandAction } from "../actions"
import { BrandForm } from "../update/components/brand-form"

export const metadata = {
  title: "Nova Brand | Admin",
  description: "Criar nova marca de produtos",
}

export default async function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/brands">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adicionar Marca</h1>
          <p className="text-muted-foreground">Adicionar uma nova marca de produtos</p>
        </div>
      </div>

      <BrandForm action={createBrandAction} />
    </div>
  )
}
