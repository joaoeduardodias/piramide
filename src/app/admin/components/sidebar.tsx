
import { Store } from "lucide-react"
import { NavItem } from "./nav-item"
import { Profile } from "./profile"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: 'layoutDashboard' },
  { name: "Produtos", href: "/admin/products", icon: 'package', badge: "1.234" },
  { name: "Pedidos", href: "/admin/orders", icon: 'shoppingCart', badge: "156" },
  { name: "Clientes", href: "/admin/clients", icon: 'users' },
  { name: "Relatórios", href: "/admin/reports", icon: 'barChart3' },
]

export function Sidebar() {

  return (
    <div className="fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col flex-grow bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-100  gap-3">
        <div className="size-8 bg-black rounded-lg flex items-center justify-center">
          <Store className="size-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900">Pirâmide Admin</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavItem icon={item.icon} href={item.href} name={item.name} badge={item.badge} key={item.name} />
        ))}
      </nav>
      <Profile />
    </div>
  )
}