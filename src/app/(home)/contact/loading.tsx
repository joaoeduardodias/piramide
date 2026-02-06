import { ContactCardSkeleton, ContactHeroSkeleton } from "@/components/skeletons/contact-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <ContactHeroSkeleton />

      <section className="py-16 md:py-24 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-80" />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <ContactCardSkeleton key={i} />
              ))}

              <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                <Skeleton className="h-5 w-40 bg-white/20 mb-3" />
                <Skeleton className="h-4 w-64 bg-white/10 mb-2" />
                <Skeleton className="h-4 w-52 bg-white/10" />
              </div>

              <div className="relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-72 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <Skeleton className="h-6 w-2/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
