import { ability } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createCategoryAction } from "../actions"
import { CategoryForm } from "../update/components/category-form"

export const metadata = {
  title: "Nova Categoria | Admin",
  description: "Criar nova categoria de produtos",
}
export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const permissions = await ability()
  if (permissions?.cannot('create', 'Product')) {
    redirect('/admin/categories')
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Categoria</h1>
          <p className="text-muted-foreground">Criar uma nova categoria de produtos</p>
        </div>
      </div>

      <CategoryForm action={createCategoryAction} />
    </div>
  )
}
