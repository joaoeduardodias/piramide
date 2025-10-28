"use client"
import logoText from '@/assets/logo-piramide.svg';
import logoImg from '@/assets/logo.png';
import { LogIn, LogOut, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartButton } from "./cart-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


interface HeaderProps {
  isAuthenticated?: boolean;
}

export function Header({ isAuthenticated }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out bg-white text-black shadow-md`}
      style={{ backdropFilter: "saturate(180%) blur(8px)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoImg}
              alt="Pirâmide Calçados Logo"
              width={30}
              height={30}
            />
            <Image
              src={logoText}
              alt="Pirâmide Calçados Logo Text"
              width={230}
              height={55}
            />

          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-900 hover:text-gray-600 transition-colors">
              Produtos
            </Link>
            <Link href="/categories" className="text-gray-900 hover:text-gray-600 transition-colors">
              Categorias
            </Link>
            <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition-colors">
              Contato
            </Link>
          </nav>

          <div className="flex items-center space-x-4 text-gray-900 hover:text-gray-600">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className={`pl-10 w-64 border-gray-200 focus:border-black`}
                />
              </div>
            </div>
            {!isAuthenticated ? (
              <Link href="/auth/sign-in">
                <Button variant="outline" >
                  <LogIn className="size-5" />
                  Fazer Login
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/sign-out">
                <Button variant="outline" >
                  <LogOut className="size-5" />
                  Sair
                </Button>
              </Link>
            )

            }

            <CartButton />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">

              <Link href="/products" className="text-gray-900 hover:text-gray-600 transition-colors">
                Produtos
              </Link>
              <Link href="/categories" className="text-gray-900 hover:text-gray-600 transition-colors">
                Categorias
              </Link>

              <Link href="/contact" className="text-gray-900 hover:text-gray-600 transition-colors">
                Contato
              </Link>
              <div className="pt-4">
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="w-full border-gray-200 focus:border-black"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}