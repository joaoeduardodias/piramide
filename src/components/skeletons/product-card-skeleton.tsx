import { Card, CardContent } from "@/components/ui/card"

interface ProductCardSkeletonProps {
  viewMode?: "grid" | "list"
}

export function ProductCardSkeleton({ viewMode = "grid" }: ProductCardSkeletonProps) {
  return (
    <Card className={`animate-pulse ${viewMode === "list" ? "flex flex-row" : ""}`}>
      <CardContent className="p-0">
        <div className={`bg-gray-200 ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "w-full h-64"}`} />

        <div className={`p-6 space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
          {/* Rating skeleton */}
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="w-12 h-4 bg-gray-200 rounded" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Price skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
