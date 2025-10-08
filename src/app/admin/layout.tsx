import type React from "react"
import { Suspense } from "react"
import { ProfileButton } from "./components/profile-button"
import { Sidebar } from "./components/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-gray-50/50">
        <Sidebar />
        <div className="lg:pl-64">
          <div className="sticky top-0  z-40 flex flex-1 h-16 self-stretch justify-between items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-4 lg:gap-x-6 lg:ml-auto">
              <ProfileButton />
            </div>
          </div>
          <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
