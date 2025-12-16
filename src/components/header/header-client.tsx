"use client"

import logoText from '@/assets/logo-piramide.svg';
import logoImg from '@/assets/logo.png';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Role } from "@/permissions/roles";
import { LogOut, Menu, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartButton } from '../cart-button';

interface HeaderClientProps {
  isAuthenticated: boolean
  user?: {
    name: string;
    email: string;
    role: Role;
  }
}

export function HeaderClient({ isAuthenticated, user }: HeaderClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name.charAt(0).toUpperCase()
  }

  const getUserName = () => {
    return user?.name || "Usuário"
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logoImg}
            alt="Pirâmide Calçados Logo"
            width={32}
            height={32}
            unoptimized
            className="h-8 w-8"
          />
          <Image
            src={logoText}
            alt="Pirâmide Calçados Logo Text"
            width={230}
            height={48}
            unoptimized
            className="h-12 w-56"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Produtos
          </Link>
          <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Categorias
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hidden md:flex"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>


          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{getUserName()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/profile">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/orders">Meus Pedidos</Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-red-600">
                  <a href='/api/auth/sign-out'>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isAuthenticated ? (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/auth/sign-in">
                <User className="h-5 w-5" />
                <span className="sr-only">Entrar</span>
              </Link>
            </Button>
          ) : null}

          <CartButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 pb-4 border-b mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{getUserName()}</p>
                    <p className="text-xs text-gray-500">{user.email || ""}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/products"
                  className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Produtos
                </Link>
                <Link
                  href="/categories"
                  className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Categorias
                </Link>

                <Link
                  href="/contact"
                  className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                >
                  Contato
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/profile"
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/auth/orders"
                      className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      Meus Pedidos
                    </Link>
                    <a
                      href='/api/auth/sign-out'
                      className="text-lg font-medium text-red-600 hover:text-red-700 transition-colors text-left"
                    >
                      Sair
                    </a>
                  </>
                ) : !isAuthenticated ? (
                  <Link
                    href="/auth/sign-in"
                    className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Entrar
                  </Link>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isSearchOpen && (
        <div className="py-4 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Buscar produtos..." className="pl-10" />
          </div>
        </div>
      )}
    </div>
  )
}

