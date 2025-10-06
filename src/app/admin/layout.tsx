"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Store,
  User,
  Users,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { Suspense, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produtos", href: "/admin/products", icon: Package, badge: "1.234" },
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart, badge: "156" },
  { name: "Clientes", href: "/admin/clients", icon: Users },
  { name: "Relatórios", href: "/admin/reports", icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-gray-50/50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Pirâmide Admin</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-gray-500">
                <X className="size-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-black rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Pirâmide Admin</span>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32&text=Admin" />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@piramide.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* header */}
          <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-5" />
            </Button>

            <div className="flex flex-1 gap-x-4 self-stretch justify-between   lg:gap-x-6">
              <div className="relative flex flex-1 items-center max-w-md">
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                  <Bell className="size-5 text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2  cursor-pointer">
                      <Avatar className="size-8">
                        {/* <AvatarImage src="/placeholder.svg?height=32&width=32&text=Admin" /> */}
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">AD</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
