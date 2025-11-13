
import { Button } from "@/components/ui/button";
import { getCategories } from "@/http/get-categories";
import Link from "next/link";
import { CategoryCard } from "./components/category-card";

export const revalidate = 3600; // 01 hour

export default async function CategoriesPage() {
  const { categories } = await getCategories()

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 text-balance">Explore Nossas Categorias</h1>
            <p className="text-xl text-slate-300 mb-8 text-pretty leading-relaxed">
              Descubra o calçado perfeito para cada momento da sua vida. De performance esportiva a elegância casual,
              temos tudo que você precisa.
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-balance">Não encontrou o que procura?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Explore nossa coleção completa ou entre em contato com nossa equipe para ajudá-lo a encontrar o calçado
            perfeito.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/">Ver Todos os Produtos</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
