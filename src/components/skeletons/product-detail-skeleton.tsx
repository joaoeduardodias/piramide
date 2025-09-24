import { Card, CardContent } from "@/components/ui/card"

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded" />
            </div>

            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />

            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 bg-gray-200 rounded w-32" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
          </div>

          {/* Color Selection Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-20 mb-3" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          {/* Quantity Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="w-12 h-6 bg-gray-200 rounded" />
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="w-32 h-4 bg-gray-200 rounded ml-4" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Benefits Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-16">
        <div className="flex gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-3 h-3 bg-gray-200 rounded" />
                      ))}
                    </div>
                    <div className="w-8 h-3 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
