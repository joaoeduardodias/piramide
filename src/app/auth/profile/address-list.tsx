"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Address } from "@/lib/types"
import { Briefcase, Building2, Home, Loader2, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteAddressAction, setDefaultAddressAction } from "./actions"
import { AddressModal } from "./address-modal"

interface AddressListProps {
  initialAddresses: Address[]
}

function getAddressIcon(name: string) {
  const nameLower = name.toLowerCase()
  if (nameLower.includes("trabalho") || nameLower.includes("escritório")) {
    return <Briefcase className="h-5 w-5" />
  }
  if (nameLower.includes("empresa") || nameLower.includes("comercial")) {
    return <Building2 className="h-5 w-5" />
  }
  return <Home className="h-5 w-5" />
}

export function AddressList({ initialAddresses }: AddressListProps) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleOpenModal() {
    setIsModalOpen(true)
  }
  function handleOpenEditModal(address: Address) {
    setEditingAddress(address)
    setIsModalOpen(true)

  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setEditingAddress(null)
  }


  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAddressAction(id)
      if (result.success) {
        toast.success("Endereço removido")
      }
      setDeletingId(null)
    })
  }

  async function handleSetDefault(id: string) {
    startTransition(async () => {
      const result = await setDefaultAddressAction(id)
      if (result.success) {
        toast.success("Endereço definido como padrão")
      }
    })
  }

  return (
    <>
      <div className="space-y-6">
        <Button
          variant="outline"
          className="w-full h-14 border-dashed border-2 bg-transparent hover:bg-primary/5 hover:border-primary transition-all"
          onClick={() => handleOpenModal()}
        >
          <Plus className="mr-2 h-5 w-5" />
          Adicionar Novo Endereço
        </Button>

        {/* Address Cards */}
        {initialAddresses.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center bg-muted/30">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Nenhum endereço cadastrado</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Adicione um endereço para facilitar suas compras e entregas
            </p>
            <Button className="mt-6" onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Endereço
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {initialAddresses.map((address) => (
              <div
                key={address.id}
                className={`group relative rounded-xl border p-5 transition-all hover:shadow-md ${address.isDefault
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-primary/50 bg-card"
                  }`}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <Badge className="absolute -top-2.5 right-3 bg-primary shadow-sm">
                    <Star className="mr-1 h-3 w-3" />
                    Padrão
                  </Badge>
                )}

                {/* Header com ícone e nome */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${address.isDefault ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {getAddressIcon(address.name)}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{address.name}</h3>
                </div>

                {/* Address Details */}
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="text-foreground">
                    {address.street}, {address.number}
                    {address.complement && ` - ${address.complement}`}
                  </p>
                  <p>
                    {address.city} - {address.state}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/80">
                    CEP: {address.postalCode.replace(/(\d{5})(\d{3})/, "$1-$2")}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 pt-4 border-t">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                      className="flex-1 bg-transparent"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Star className="mr-1.5 h-3.5 w-3.5" />
                          Definir Padrão
                        </>
                      )}
                    </Button>
                  )}
                  {address.isDefault && <div className="flex-1" />}
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(address)} className="h-9 w-9">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingId(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        address={editingAddress}

      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O endereço será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
