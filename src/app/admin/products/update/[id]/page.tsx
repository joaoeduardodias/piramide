import { ability } from "@/auth/auth"
import { Button } from "@/components/ui/button"
import { getBrands } from "@/http/get-brands"
import { getCategories } from "@/http/get-categories"
import { getOptions } from "@/http/get-options"
import { getProductById } from "@/http/get-product-by-id"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FormUpdateProduct } from "../components/form-update-product"

interface PageProps {
  params: Promise<{ id: string }>
}
export const dynamic = "force-dynamic";


export default async function UpdateProductPage({ params }: PageProps) {
  const { id } = await params
  const permissions = await ability()
  if (permissions?.cannot('update', 'Product')) {
    redirect('/admin/products')
  }
  const { categories } = await getCategories()
  const { product } = await getProductById({ id })
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
            <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
            <p className="text-gray-600 mt-1">Edite o produto</p>
          </div>
        </div>
      </div>

      <FormUpdateProduct options={options} categories={categories} brands={brands} initialData={product} />
    </div>
  )
}
