import { Button } from "@/components/ui/button"
import { Plus, type LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  illustration?: "orders" | "products" | "customers" | "analytics"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  illustration = "orders",
}: EmptyStateProps) {
  const illustrations = {
    orders: (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="orderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="orderAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="url(#orderGradient)" className="animate-pulse" />
        <rect x="70" y="80" width="100" height="100" rx="8" fill="white" stroke="url(#orderAccent)" strokeWidth="3" />
        <path
          d="M95 80V65c0-13.8 11.2-25 25-25s25 11.2 25 25v15"
          stroke="url(#orderAccent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="85" y="110" width="70" height="8" rx="4" fill="#E0E7FF" />
        <rect x="85" y="130" width="50" height="8" rx="4" fill="#E0E7FF" />
        <rect x="85" y="150" width="60" height="8" rx="4" fill="#E0E7FF" />
        <circle cx="95" cy="114" r="2" fill="#3B82F6" />
        <circle cx="95" cy="134" r="2" fill="#3B82F6" />
        <circle cx="95" cy="154" r="2" fill="#3B82F6" />
      </svg>
    ),
    products: (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="productAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="url(#productGradient)" className="animate-pulse" />
        <path
          d="M65 95c0-8 6-14 14-14h82c8 0 14 6 14 14v70c0 8-6 14-14 14H79c-8 0-14-6-14-14V95z"
          fill="white"
          stroke="url(#productAccent)"
          strokeWidth="3"
        />
        <path
          d="M85 81V70c0-19.3 15.7-35 35-35s35 15.7 35 35v11"
          stroke="url(#productAccent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="90" y="115" width="60" height="40" rx="6" fill="#D1FAE5" />
        <path d="M105 130h30M105 145h20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="105" r="8" fill="#10B981" />
        <path d="M147 105l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    customers: (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="customerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="customerAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="url(#customerGradient)" className="animate-pulse" />
        <circle cx="120" cy="95" r="28" fill="white" stroke="url(#customerAccent)" strokeWidth="3" />
        <path
          d="M75 165c0-24.9 20.1-45 45-45s45 20.1 45 45"
          fill="white"
          stroke="url(#customerAccent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="80" cy="105" r="18" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" opacity="0.7" />
        <circle cx="160" cy="105" r="18" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
        <path d="M65 145c0-12 8-20 15-20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M175 145c0-12-8-20-15-20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
    analytics: (
      <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="analyticsAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="100" fill="url(#analyticsGradient)" className="animate-pulse" />
        <rect
          x="65"
          y="125"
          width="28"
          height="50"
          rx="6"
          fill="white"
          stroke="url(#analyticsAccent)"
          strokeWidth="3"
        />
        <rect
          x="106"
          y="100"
          width="28"
          height="75"
          rx="6"
          fill="white"
          stroke="url(#analyticsAccent)"
          strokeWidth="3"
        />
        <rect
          x="147"
          y="80"
          width="28"
          height="95"
          rx="6"
          fill="white"
          stroke="url(#analyticsAccent)"
          strokeWidth="3"
        />
        <path
          d="M55 70l35 25 35-20 40 15"
          stroke="url(#analyticsAccent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="55" cy="70" r="5" fill="#8B5CF6" />
        <circle cx="90" cy="95" r="5" fill="#A78BFA" />
        <circle cx="125" cy="75" r="5" fill="#C084FC" />
        <circle cx="165" cy="90" r="5" fill="#EC4899" />
      </svg>
    ),
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {illustrations[illustration]}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-lg">
          <Icon className="size-10 text-gray-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-base text-gray-600 max-w-md mb-8 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}
