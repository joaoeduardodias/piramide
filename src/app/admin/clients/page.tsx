import { Suspense } from "react"
import { ClientList } from "./components/client-list"
import { ClientsStats } from "./components/clients-stats"

export const metadata = {
  title: "Clientes | Dashboard",
  description: "Gerencie os clientes de sua loja.",
}


export default async function ClientPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie sua base de clientes
        </p>
      </div>

      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <ClientsStats />
      </Suspense>
      <ClientList />
    </div>
  )
}
