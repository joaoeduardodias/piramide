"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/use-form-state"
import type { Address, ViaCepResponse } from "@/lib/types"
import { formatCEP } from "@/lib/validations"
import ky from "ky"
import { AlertTriangle, Loader2, MapPin, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createAddressAction, updateAddressAction } from "./actions"

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  address: Address | null
}

export function AddressModal({ isOpen, onClose, address }: AddressModalProps) {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(address ? updateAddressAction : createAddressAction,
    () => {
      toast.success(address ? "Endereço atualizado com sucesso!" : "Endereço adicionado com sucesso!")
      onClose()
    }
  )
  const isEditing = address !== null
  const [isSearchingCep, setIsSearchingCep] = useState(false)
  const [name, setName] = useState(address?.name ?? "")
  const [postalCode, setPostalCode] = useState(address?.postalCode ?? "")
  const [street, setStreet] = useState(address?.street ?? "")
  const [district, setDistrict] = useState(address?.district ?? "")
  const [city, setCity] = useState(address?.city ?? "")
  const [uf, setUf] = useState(address?.state ?? "")
  const [number, setNumber] = useState(address?.number ?? "")
  const [complement, setComplement] = useState(address?.complement ?? "")
  const [isDefault, setIsDefault] = useState(true)


  useEffect(() => {
    if (address) {
      setName(address.name ?? "")
      setPostalCode(formatCEP(address.postalCode) ?? "")
      setStreet(address.street ?? "")
      setDistrict(address.district ?? "")
      setCity(address.city ?? "")
      setUf(address.state ?? "")
      setNumber(address.number === null || address.number === undefined ? "" : String(address.number))
      setComplement(address.complement ?? "")
      setIsDefault(address.isDefault ?? false)
    } else {
      setName("")
      setPostalCode("")
      setStreet("")
      setDistrict("")
      setCity("")
      setUf("")
      setNumber("")
      setComplement("")
      setIsDefault(true)
    }
  }, [address, isOpen])


  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCEP(e.target.value)
    if (formatted.replace(/\D/g, "").length <= 8) {
      setPostalCode(formatted)
    }
  }

  async function searchCep() {
    const cep = postalCode.replace(/\D/g, "")
    if (cep.length !== 8) {
      toast.error("CEP inválido.")
      return
    }

    setIsSearchingCep(true)
    try {
      const response = await ky.get(`https://viacep.com.br/ws/${cep}/json/`).json<ViaCepResponse>()

      if (response.erro) {
        toast.error("CEP não encontrado")
        return
      }
      setStreet(response.logradouro || "")
      setDistrict(response.bairro || "")
      setCity(response.localidade || "")
      setUf(response.uf || "")
      setComplement(response.complemento || "")


    } catch (error) {
      toast.error("Erro ao buscar CEP", {
        description: "Não foi possível consultar o CEP. Tente novamente.",
      })
    } finally {
      setIsSearchingCep(false)
    }
  }

  useEffect(() => {
    const cep = postalCode.replace(/\D/g, "")
    if (cep.length === 8 && !isEditing) {
      searchCep()
    }
  }, [postalCode])


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {isEditing ? "Editar Endereço" : "Novo Endereço"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do endereço abaixo."
              : "Preencha o CEP para buscar o endereço automaticamente."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {address && (
            <input type="hidden" name="id" value={address.id} />
          )}
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro Encontrado</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )
          }
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Endereço</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Casa, Trabalho, Mãe..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors?.name && (
              <p className="text-xs ml-1 text-red-600">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">CEP</Label>
            <div className="flex gap-2">
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="00000-000"
                value={postalCode}
                onChange={handleCepChange}
                className="font-mono"
                required
              />
              <Button type="button" variant="outline" onClick={searchCep} disabled={isSearchingCep}>
                {isSearchingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              {errors?.postalCode && (
                <p className="text-xs ml-1 text-red-600">{errors.postalCode[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua / Logradouro</Label>
            <Input
              id="street"
              name="street"
              placeholder="Rua, Avenida, etc."
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
            {errors?.street && (
              <p className="text-xs ml-1 text-red-600">{errors.street[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                placeholder="123"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
              {errors?.number && (
                <p className="text-xs ml-1 text-red-600">{errors.number[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                name="complement"
                placeholder="Apto, Bloco..."
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
              {errors?.complement && (
                <p className="text-xs ml-1 text-red-600">{errors.complement[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Bairro</Label>
            <Input
              id="district"
              name="district"
              placeholder="Nome do bairro"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            {errors?.district && (
              <p className="text-xs ml-1 text-red-600">{errors.district[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                placeholder="Nome da cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              {errors?.city && (
                <p className="text-xs ml-1 text-red-600">{errors.city[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">UF</Label>
              <Input
                id="state"
                name="state"
                placeholder="SP"
                maxLength={2}
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
                required
              />
              {errors?.state && (
                <p className="text-xs ml-1 text-red-600">{errors.state[0]}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <>
              <input
                type="hidden"
                name="isDefault"
                value={isDefault ? "true" : "false"}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(checked) => setIsDefault(checked === true)}
                />
                <Label htmlFor="isDefault" className="cursor-pointer text-sm">
                  Definir como endereço padrão
                </Label>
              </div>
            </>
          )}


          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Adicionar Endereço"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
