import { Card, CardContent } from "@/components/ui/card"

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-5 bg-gray-200 rounded w-16 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CategoryDetailSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
        >
          {/* Category Image Skeleton */}
          <div className="lg:w-1/2">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="w-full h-80 bg-gray-200" />
              <div className="absolute bottom-6 left-6 space-y-2">
                <div className="w-24 h-6 bg-gray-300 rounded" />
                <div className="w-32 h-8 bg-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Category Info Skeleton */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-4" />
              <div className="space-y-2 mb-6">
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-12 bg-gray-200 rounded w-48" />
            </div>

            {/* Featured Products Skeleton */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <div className="w-full h-32 bg-gray-200" />
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="w-3 h-3 bg-gray-200 rounded" />
                            ))}
                          </div>
                          <div className="w-8 h-3 bg-gray-200 rounded" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
