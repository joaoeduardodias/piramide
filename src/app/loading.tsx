import { CategoryGridSkeleton } from "@/components/skeletons/category-skeleton"
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="w-40 h-6 bg-gray-200 rounded" />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-16 h-4 bg-gray-200 rounded" />
              ))}
            </nav>

            <div className="w-10 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </header>

      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Categories Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-12 animate-pulse" />
          <CategoryGridSkeleton />
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-56" />
            <div className="w-24 h-6 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="py-16 bg-gray-200 animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4" />
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="h-12 bg-gray-300 rounded flex-1" />
            <div className="h-12 bg-gray-300 rounded w-32" />
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-100 py-12 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
