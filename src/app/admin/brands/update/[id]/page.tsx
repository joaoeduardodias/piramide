import { ability } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { getBrandById } from "@/http/get-brand-by-id"
import { ArrowLeft, FolderTree, Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { updateBrandAction } from "../../actions"
import { BrandForm } from "../components/brand-form"

export const metadata = {
  title: "Editar Marca | Admin",
  description: "Editar marca de produtos",
}
export const dynamic = "force-dynamic";

export default async function UpdateBrandPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const permissions = await ability()
  if (permissions?.cannot('create', 'Product')) {
    redirect('/admin/brands')
  }



  const { id } = await params
  const { brand } = await getBrandById({ id })

  if (!brand) return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
      <FolderTree className="size-12 text-muted-foreground" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Nenhuma marca encontrada</h3>
        <p className="text-sm text-muted-foreground">Comece criando sua primeira marca de produtos</p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/admin/brands/new">
          <Plus className="mr-2 size-4" />
          Adicionar Marca
        </Link>
      </Button>
    </div>
  )
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/brands">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Marca</h1>
          <p className="text-muted-foreground">{brand.name}</p>
        </div>
      </div>


      <BrandForm initialData={brand} action={updateBrandAction} />

    </div>
  )

}
