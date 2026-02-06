import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-background w-full">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-20 w-20 rounded-full bg-white/10 mb-6" />
            <Skeleton className="h-8 w-64 bg-white/10 mb-3" />
            <Skeleton className="h-5 w-80 bg-white/10" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <Skeleton className="h-4 w-28 mb-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>

            <Skeleton className="h-12 w-full" />
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="p-6 bg-muted/30 border-b">
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[...Array(2)].map((__, j) => (
                  <div key={j} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
