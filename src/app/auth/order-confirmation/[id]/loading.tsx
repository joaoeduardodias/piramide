import { Skeleton } from "@/components/ui/skeleton"

export default function OrderConfirmationLoading() {
  return (
    <div className="min-h-screen bg-background w-full">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-20 w-20 rounded-full bg-white/10 mb-6" />
            <Skeleton className="h-8 w-72 bg-white/10 mb-3" />
            <Skeleton className="h-5 w-80 bg-white/10 mb-2" />
            <Skeleton className="h-5 w-40 bg-white/10" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((__, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
