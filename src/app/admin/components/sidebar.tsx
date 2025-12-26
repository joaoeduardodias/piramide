
import { getBrands } from "@/http/get-brands"
import { getCategories } from "@/http/get-categories"
import { getCoupons } from "@/http/get-coupons"
import { getCustomers } from "@/http/get-customers"
import { getOrders } from "@/http/get-orders"
import { getProducts } from "@/http/get-products"
import { Store } from "lucide-react"
import { NavItem } from "./nav-item"
import { Profile } from "./profile"



export async function Sidebar() {

  const { pagination: paginationCategories } = await getCategories()
  const { pagination: paginationBrand } = await getBrands()
  const { pagination: paginationCoupons } = await getCoupons()
  const { pagination: paginationOrder } = await getOrders()
  const { pagination: paginationProduct } = await getProducts()
  const { pagination: paginationCustomer } = await getCustomers()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: 'layoutDashboard' },
    { name: "Produtos", href: "/admin/products", icon: 'package', badge: paginationProduct.total },
    { name: "Categorias", href: "/admin/categories", icon: "folderTree", badge: paginationCategories.total },
    { name: "Marcas", href: "/admin/brands", icon: "hexagon", badge: paginationBrand.total },
    { name: "Cupons", href: "/admin/coupons", icon: "tag", badge: paginationCoupons.total },
    { name: "Pedidos", href: "/admin/orders", icon: 'shoppingCart', badge: paginationOrder.total },
    { name: "Clientes", href: "/admin/clients", icon: 'users', badge: paginationCustomer.total },
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