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
      <div className="flex justify-between items-center mt-5">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600">Gerencie sua base de clientes</p>
      </div>

      <Suspense fallback={<div>Carregando estatísticas...</div>}>
        <ClientsStats />
      </Suspense>

      <ClientList />

    </div>
  )
}
