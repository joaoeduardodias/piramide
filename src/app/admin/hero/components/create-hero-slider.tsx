"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import { getSignedUrl } from "@/http/get-signed-url"
import { queryClient } from "@/lib/query-client"
import { AlertTriangle, Loader2, Plus } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { createHeroBannerAction } from "../actions"
import { HeroImageUpload, type HeroImage } from "./hero-image-upload"

export function CreateHeroBanner() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [{ success, message, errors }, handleSubmit] = useFormState(createHeroBannerAction,
    () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] })
      setCreateDialogOpen(false)
      setHeroImage(null)
    }
  )


  const onCreateHeroBanner = useCallback(async () => {
    try {
      setIsPending(true)
      if (!heroImage?.file) {
        toast.error("Selecione uma imagem para o banner")
        return
      }

      const form = formRef.current
      if (!form) return


      const { uploads } = await getSignedUrl({
        files: [
          {
            fileName: heroImage.file.name,
            contentType: heroImage.file.type,
          },
        ],
      })

      const upload = uploads[0]

      await fetch(upload.presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": upload.contentType },
        body: heroImage.file,
      })

      let input = form.querySelector<HTMLInputElement>('input[name="image"]')
      if (!input) {
        input = document.createElement("input")
        input.type = "hidden"
        input.name = "image"
        form.appendChild(input)
      }

      input.value = upload.url

      form.requestSubmit()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao enviar imagem do banner")
    } finally {
      setIsPending(false)
    }
  }, [heroImage])


  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Novo Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl! max-h-[90vh] overflow-y-auto">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Erro encontrado</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <DialogHeader>
          <DialogTitle>Criar Novo Banner</DialogTitle>
          <DialogDescription>Preencha os dados do banner hero</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="hidden" name="image" />
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Título</Label>
                <Input id="create-title" name="title" placeholder="Nova Coleção Verão" required />
                {errors?.title && (
                  <p className="text-xs ml-1 text-red-600">{errors.title[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-subtitle">Subtítulo</Label>
                <Input id="create-subtitle" name="subtitle" placeholder="Chegou a Nova Temporada" required />
                {errors?.subtitle && (
                  <p className="text-xs ml-1 text-red-600">{errors.subtitle[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Descrição</Label>
              <Textarea
                id="create-description"
                name="description"
                placeholder="Descrição detalhada do banner..."
                required
                rows={3}
              />
              {errors?.description && (
                <p className="text-xs ml-1 text-red-600">{errors.description[0]}</p>
              )}
            </div>

            <HeroImageUpload
              image={heroImage}
              setImage={setHeroImage}
            />


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-cta">Texto do Botão</Label>
                <Input id="create-cta" name="cta" placeholder="Ver Coleção" required />
                {errors?.cta && (
                  <p className="text-xs ml-1 text-red-600">{errors.cta[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-link">Link de Destino</Label>
                <Input id="create-link" name="link" placeholder="/categories/nova-colecao" required />
                {errors?.link && (
                  <p className="text-xs ml-1 text-red-600">{errors.link[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-order">Ordem de Exibição</Label>
                <Input id="create-order" name="order" type="number" min="0" defaultValue="0" required />
                <p className="text-xs text-muted-foreground">Quanto menor o número, mais cedo aparece</p>
                {errors?.order && (
                  <p className="text-xs ml-1 text-red-600">{errors.order[0]}</p>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg w-full">
                  <Label htmlFor="create-isActive" className="cursor-pointer">
                    Banner Ativo
                  </Label>
                  <Switch id="create-isActive" name="isActive" defaultChecked value="true" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onCreateHeroBanner}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Banner"
              )}
            </Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
