import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BrandsTableClient } from "./components/brands-table"

export const metadata = {
  title: "Marcas | Dashboard",
  description: "Gerencie as marcas de produtos",
}

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
          <p className="text-muted-foreground">
            Gerencie as marcas de produtos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/brands/new">
            <Plus className="mr-2 size-4" />
            Adicionar Marca
          </Link>
        </Button>
      </div>

      <BrandsTableClient />
    </div>
  )
}
