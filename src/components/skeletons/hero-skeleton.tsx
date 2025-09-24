export function HeroSkeleton() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden animate-pulse">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge skeleton */}
          <div className="inline-block h-8 bg-gray-300 rounded-full w-48" />

          {/* Title skeleton */}
          <div className="space-y-4">
            <div className="h-16 bg-gray-300 rounded w-3/4 mx-auto" />
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-6 bg-gray-300 rounded w-full" />
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
          </div>

          {/* Stats skeleton */}
          <div className="flex items-center justify-center gap-8 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-gray-300 rounded w-16 mx-auto" />
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>

          {/* Button skeleton */}
          <div className="h-12 bg-gray-300 rounded w-48 mx-auto" />
        </div>
      </div>
    </section>
  )
}
