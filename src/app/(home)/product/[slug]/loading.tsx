import { ProductDetailSkeleton } from "@/components/skeletons/product-detail-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b mt-17 px-4 py-4">
        <Skeleton className="h-4 w-64" />
      </div>
      <ProductDetailSkeleton />
    </div>
  )
}
