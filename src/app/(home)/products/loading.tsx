import { FilterSkeleton } from "@/components/skeletons/filter-skeleton"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto px-4 text-center space-y-4">
          <Skeleton className="h-10 w-2/3 mx-auto bg-white/10" />
          <Skeleton className="h-5 w-1/2 mx-auto bg-white/10" />
          <Skeleton className="h-12 w-full max-w-md mx-auto bg-white/10" />
        </div>
      </section>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 mt-8 pb-12">
        <div className="lg:w-80 w-full">
          <FilterSkeleton />
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
