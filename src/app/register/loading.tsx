export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-300 h-14 w-14 rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="space-y-3 mt-6">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-blue-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
