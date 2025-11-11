import { ability } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { getBrands } from "@/http/get-brands";
import { getCategories } from "@/http/get-categories";
import { getOptions } from "@/http/get-options";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormCreateProduct } from "./components/form-create-product";

export const metadata = {
  title: "Novo Produto | Dashboard",
  description: "Criar novo produto",
}
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const permissions = await ability()
  if (permissions?.cannot('create', 'Product')) {
    redirect('/admin/products')
  }

  const { categories } = await getCategories()
  const { options } = await getOptions()
  const { brands } = await getBrands()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Produto</h1>
            <p className="text-gray-600 mt-1">Adicione um novo produto ao seu catálogo</p>
          </div>
        </div>

      </div>

      <FormCreateProduct brands={brands} options={options} categories={categories} />
    </div>
  )
}
