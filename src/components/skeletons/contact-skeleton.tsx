import { Card, CardContent } from "@/components/ui/card"

export function ContactHeroSkeleton() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge skeleton */}
          <div className="inline-block h-10 bg-gray-300 rounded-full w-56" />

          {/* Title skeleton */}
          <div className="space-y-6">
            <div className="h-20 bg-gray-300 rounded w-2/3 mx-auto" />
            <div className="h-16 bg-gray-300 rounded w-1/2 mx-auto" />
            <div className="h-12 bg-gray-300 rounded w-1/3 mx-auto" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="h-6 bg-gray-300 rounded w-full" />
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="h-14 bg-gray-300 rounded-2xl w-48" />
            <div className="h-14 bg-gray-300 rounded-2xl w-40" />
            <div className="h-14 bg-gray-300 rounded-2xl w-40" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-3xl p-8 space-y-6">
                <div className="w-20 h-20 bg-gray-400 rounded-2xl mx-auto" />
                <div className="h-12 bg-gray-400 rounded w-20 mx-auto" />
                <div className="h-6 bg-gray-400 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactFormSkeleton() {
  return (
    <Card className="shadow-xl border-0 bg-white animate-pulse">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-16" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-32 bg-gray-200 rounded w-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ContactCardSkeleton() {
  return (
    <Card className="shadow-lg border-0 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
