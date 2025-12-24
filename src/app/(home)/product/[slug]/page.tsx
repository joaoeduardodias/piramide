import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getProductBySlug } from "@/http/get-product-by-slug"
import { formatReal } from "@/lib/validations"
import { RotateCcw, Shield, Truck } from "lucide-react"
import Link from "next/link"
import { FormSelectProduct } from "./components/form-select-product"
import { GridImages } from "./components/grid-images"

type Props = {
  params: Promise<{ slug: string }>
}

// export async function generateStaticParams(): Promise<{ slug: string }[]> {
//   const { products } = await getProducts({ sortBy: "relevance", limit: 100 });
//   return products.map((product) => ({ slug: product.slug }));
// }

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {

//   const { slug } = await params
//   const { product } = await getProductBySlug({ slug })
//   const previousImages = (await parent).openGraph?.images || []

//   return {
//     title: `${product.name} | Piramide Calçados`,
//     openGraph: {
//       images: [
//         product?.images?.[0]?.url || "/placeholder.png",
//         ...previousImages,
//       ],
//     },
//   }
// }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { product } = await getProductBySlug({ slug })
  console.log(product);

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link href="/products">Voltar para produtos</Link>
          </Button>
        </div>
      </main>
    )
  }
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b mt-17 px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">
            Produtos
          </Link>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-2 gap-12">
        {product.images && (
          <GridImages discount={discount} images={product.images} />
        )}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {formatReal(String(product.price))}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatReal(String(product?.comparePrice ?? ''))}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium">
              ou 10x de R$ {((product.price / 100) / 10).toFixed(2).replace(".", ",")} sem juros
            </p>
          </div>
          <FormSelectProduct discount={discount} product={product} />

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Frete Grátis</p>
                    <p className="text-xs text-gray-600 mt-1">Acima de R$ 199</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Troca Fácil</p>
                    <p className="text-xs text-gray-600 mt-1">30 dias para trocar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Compra Segura</p>
                    <p className="text-xs text-gray-600 mt-1">Dados protegidos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {product.description && (
            <div className="mt-16 max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Produto</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-8">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
