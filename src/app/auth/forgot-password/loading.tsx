import { Skeleton } from "@/components/ui/skeleton"

export default function ForgotPasswordLoading() {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg animate-pulse">
      <div className="flex items-center justify-center mb-6">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Skeleton className="h-7 w-2/3 mx-auto mb-2" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
