import { Card, CardContent } from "@/components/ui/card"

export function FilterSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>

        <div className="space-y-6">
          {/* Category filter skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-20 mb-3" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Brand filter skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-16 mb-3" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>

          {/* Price range skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-full" />
          </div>

          {/* Colors filter skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-16 mb-3" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Sizes filter skeleton */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-20 mb-3" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
