import { Providers } from "@/app/providers"
import { auth } from "@/auth/auth"
import { Header } from "@/components/header"
import { getAddressesByUser } from "@/http/get-addresses"
import { MapPin, Package, User } from "lucide-react"
import Link from "next/link"
import { AddressList } from "./address-list"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  const { user: profile } = await auth()
  const { addresses } = await getAddressesByUser()

  return (
    <Providers>
      <Header />
      <div className="min-h-screen bg-background w-full">

        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">
                Olá, {profile.name.split(" ")[0]}!
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">Gerencie suas informações pessoais e endereços de entrega</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
                    <p className="text-sm text-muted-foreground">CPF e telefone</p>
                  </div>
                </div>

                <ProfileForm
                  initialCpf={profile.cpf || ""}
                  initialPhone={profile.phone || ""}
                  userName={profile.name}
                  userEmail={profile.email}
                />
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">Atalhos</h3>
                <nav className="space-y-1">
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>Meus Pedidos</span>
                  </Link>
                  <Link
                    href="auth/profile?#addresses"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Endereços</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          <main className="flex-1" id="addresses">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Meus Endereços</h2>
                    <p className="text-sm text-muted-foreground">Gerencie seus endereços de entrega</p>
                  </div>
                </div>
              </div>

              <AddressList initialAddresses={addresses} />
            </div>
          </main>

        </div>
      </div>
    </Providers>
  )
}
