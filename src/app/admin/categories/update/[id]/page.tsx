import { Button } from "@/components/ui/button"
import { getCategoryById } from "@/http/get-category-by-id"
import { ArrowLeft, FolderTree, Plus } from "lucide-react"
import Link from "next/link"
import { updateCategoryAction } from "../../actions"
import { CategoryForm } from "../components/category-form"

export const metadata = {
  title: "Editar Categoria | Admin",
  description: "Editar categoria de produtos",
}
export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const { category } = await getCategoryById({ id })

  if (!category) return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
      <FolderTree className="size-12 text-muted-foreground" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Nenhuma categoria encontrada</h3>
        <p className="text-sm text-muted-foreground">Comece criando sua primeira categoria de produtos</p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/admin/categories/new">
          <Plus className="mr-2 size-4" />
          Nova Categoria
        </Link>
      </Button>
    </div>
  )
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Categoria</h1>
          <p className="text-muted-foreground">{category.name}</p>
        </div>
      </div>


      <CategoryForm initialData={category} action={updateCategoryAction} />

    </div>
  )

}
