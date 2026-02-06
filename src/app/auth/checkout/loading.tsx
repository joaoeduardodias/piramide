import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background w-full">
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-20 w-20 rounded-full bg-white/10 mb-6" />
            <Skeleton className="h-8 w-72 bg-white/10 mb-3" />
            <Skeleton className="h-5 w-80 bg-white/10" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((__, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-56 mb-6" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
