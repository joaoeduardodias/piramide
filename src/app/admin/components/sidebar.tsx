
import { getBrands } from "@/http/get-brands"
import { getCategories } from "@/http/get-categories"
import { getProducts } from "@/http/get-products"
import { Store } from "lucide-react"
import { NavItem } from "./nav-item"
import { Profile } from "./profile"



export async function Sidebar() {

  const { categories } = await getCategories()
  const { brands } = await getBrands()
  const { products } = await getProducts()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: 'layoutDashboard' },
    { name: "Produtos", href: "/admin/products", icon: 'package', badge: products.length },
    { name: "Categorias", href: "/admin/categories", icon: "folderTree", badge: categories.length },
    { name: "Marcas", href: "/admin/brands", icon: "hexagon", badge: brands.length },
    { name: "Pedidos", href: "/admin/orders", icon: 'shoppingCart', badge: 156 },
    { name: "Clientes", href: "/admin/clients", icon: 'users' },
    { name: "Relatórios", href: "/admin/reports", icon: 'barChart3' },
  ]

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