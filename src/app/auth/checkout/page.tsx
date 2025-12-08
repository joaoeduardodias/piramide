import { auth } from "@/auth/auth";
import { getAddressesByUser } from "@/http/get-addresses";
import { ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";
import { FormCheckout } from "./components/form-checkout";

export default async function CheckoutPage() {
  const { addresses } = await getAddressesByUser()
  const { user: profile } = await auth()

  if (!addresses || profile.cpf === null || profile.phone === null) {
    redirect("/auth/profile?from=cart");
  }

  return (
    <>
      <div className="min-h-screen bg-background w-full">
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 text-balance">
                {profile.name.split(" ")[0]}, finalize sua compra!
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mb-6">
                Confirme suas informações para completar a compra
              </p>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-8">
          <FormCheckout addresses={addresses} />
        </div>
      </div>
    </>
  )
}
