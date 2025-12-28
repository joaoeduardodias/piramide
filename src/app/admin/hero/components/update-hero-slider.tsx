
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from "@/hooks/use-form-state"
import type { HeroBanner } from "@/http/get-hero-banners"
import { getSignedUrl } from "@/http/get-signed-url"
import { queryClient } from "@/lib/query-client"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { AlertTriangle, Edit, Loader2 } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { updateHeroBannerAction } from "../actions"
import { HeroImageUpload, type HeroImage } from "./hero-image-upload"

export interface UpdateHeroSliderProps {
  banner: HeroBanner
}

export function UpdateHeroSlider({ banner }: UpdateHeroSliderProps) {
  const [open, setOpen] = useState(false)
  const [heroImage, setHeroImage] = useState<HeroImage | null>({
    previewUrl: banner.image,
    isExisting: true,
  })
  const [isPending, setIsPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [{ success, message, errors }, handleSubmit] = useFormState(updateHeroBannerAction,
    () => {
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] })
      setOpen(false)
    }
  )

  const onUpdateHeroBanner = useCallback(async () => {
    try {
      setIsPending(true)
      if (!heroImage) {
        toast.error("Banner sem imagem")
        return
      }

      const form = formRef.current
      if (!form) return
      let input = form.querySelector<HTMLInputElement>('input[name="image"]')
      if (!input) return

      if (heroImage.file) {
        const { uploads } = await getSignedUrl({
          files: [{
            fileName: heroImage.file.name,
            contentType: heroImage.file.type,
          }],
        })

        const upload = uploads[0]

        await fetch(upload.presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": upload.contentType },
          body: heroImage.file,
        })

        input.value = upload.url
      } else {
        input.value = heroImage.previewUrl
      }

      form.requestSubmit()
    } catch (error) {
      console.error(error)
      toast.error("Erro ao enviar imagem do banner")
    } finally {
      setIsPending(false)
    }
  }, [heroImage])
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
          <DialogTitle>Editar Banner</DialogTitle>
          <DialogDescription>Altere as informações do banner</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="hidden" name="bannerId" value={banner.id} />
          <input type="hidden" name="image" />
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input id="edit-title" name="title" defaultValue={banner.title} required />
                {errors?.title && (
                  <p className="text-xs ml-1 text-red-600">{errors.title[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtítulo</Label>
                <Input id="edit-subtitle" name="subtitle" defaultValue={banner.subtitle} required />
                {errors?.subtitle && (
                  <p className="text-xs ml-1 text-red-600">{errors.subtitle[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={banner.description}
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
                <Label htmlFor="edit-cta">Texto do Botão</Label>
                <Input id="edit-cta" name="cta" defaultValue={banner.cta} required />
              </div>
              {errors?.cta && (
                <p className="text-xs ml-1 text-red-600">{errors.cta[0]}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-link">Link de Destino</Label>
                <Input id="edit-link" name="link" defaultValue={banner.link} required />
              </div>
              {errors?.link && (
                <p className="text-xs ml-1 text-red-600">{errors.link[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-order">Ordem de Exibição</Label>
                <Input
                  id="edit-order"
                  name="order"
                  type="number"
                  min="0"
                  defaultValue={banner.order}
                  required
                />
                {errors?.order && (
                  <p className="text-xs ml-1 text-red-600">{errors.order[0]}</p>
                )}
              </div>
              <div className="flex items-end">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg w-full">
                  <Label htmlFor="edit-isActive" className="cursor-pointer">
                    Banner Ativo
                  </Label>
                  <Switch
                    id="edit-isActive"
                    name="isActive"
                    defaultChecked={banner.isActive}
                    value="true"
                  />
                  {errors?.isActive && (
                    <p className="text-xs ml-1 text-red-600">{errors.isActive[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="space-x-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onUpdateHeroBanner}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}