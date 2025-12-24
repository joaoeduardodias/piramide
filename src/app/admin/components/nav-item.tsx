"use client"
import { Badge } from "@/components/ui/badge";
import { getBasePath } from "@/utils/get-base-path";
import { BarChart3, FolderTree, Hexagon, LayoutDashboard, Package, ShoppingCart, Tag, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const icons: Record<string, LucideIcon> = {
  barChart3: BarChart3,
  layoutDashboard: LayoutDashboard,
  package: Package,
  users: Users,
  shoppingCart: ShoppingCart,
  folderTree: FolderTree,
  hexagon: Hexagon,
  tag: Tag,
};

export interface NavItemProps {
  name: string;
  href: string;
  icon: keyof typeof icons;
  badge?: number;
}


export function NavItem({ href, icon, name, badge }: NavItemProps) {
  const pathname = usePathname();
  const basePath = getBasePath(pathname)
  const isActive = basePath === href;
  const Icon = icons[icon];
  if (!Icon) return null;
  return (
    <Link
      key={name}
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors 
        ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-5" />
        {name}
      </div>
      {badge && (
        <Badge variant="secondary" className="text-xs">
          {badge}
        </Badge>
      )}
    </Link>
  )
}