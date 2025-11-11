"use client"
import logoText from '@/assets/logo-piramide.svg';
import logoImg from '@/assets/logo.png';
import { LayoutIcon, Menu, User2, UserX2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { CartButton } from "./cart-button";
import { Button } from "./ui/button";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [auth, setAuth] = useState<AuthState>({ isAuthenticated: false, isAdmin: false });
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session")
        if (!res.ok) return
        const data = await res.json()
        setAuth({ isAuthenticated: data.isAuthenticated, isAdmin: data.isAdmin })
      } catch { }
    }
    checkAuth()
  }, [])

  function handleSignOut() {
    router.push('/api/auth/sign-out')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out bg-white text-black shadow-md`}
      style={{ backdropFilter: "saturate(180%) blur(8px)" }}
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="w-72 overflow-hidden">
            <Link href="/" className="flex items-center  space-x-2">
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
          </div>
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
          <div className="hidden md:flex w-72 items-center justify-end space-x-4 text-gray-900 hover:text-gray-600">
            {!auth.isAuthenticated ? (
              <Link href="/auth/sign-in">
                <Button variant="ghost">
                  <User2 className="size-5" />
                  <span className='sr-only'>Fazer Login</span>
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" onClick={handleSignOut}>
                <UserX2 className="size-5" />
                <span className="sr-only">Sair</span>
              </Button>
            )}
            {auth.isAdmin && (
              <Link href="/admin">
                <Button variant="ghost">
                  <LayoutIcon className="size-5" />
                  <span className="sr-only">Dashboard</span>
                </Button>
              </Link>
            )}
            <CartButton />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}