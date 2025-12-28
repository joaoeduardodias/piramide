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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useHeroBanners, type HeroBanner } from "@/http/get-hero-banners"
import { queryClient } from "@/lib/query-client"
import { ArrowUpDown, ExternalLink, ImageIcon, Loader2, Trash2 } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"
import { deleteBannerAction, toggleBannerStatus } from "../actions"
import { UpdateHeroSlider } from "./update-hero-slider"

export function HeroBannersTable() {
  const { data: banners, error, isLoading } = useHeroBanners()
  const [isPending, startTransition] = useTransition()



  const handleToggleStatus = (banner: HeroBanner) => {
    startTransition(async () => {
      const result = await toggleBannerStatus(banner.id, !banner.isActive)
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['hero-banners'] })
      } else {
        toast.error("Erro", { description: result.message })
      }
    })
  }

  const handleDelete = (bannerId: string) => {
    startTransition(async () => {
      const result = await deleteBannerAction(bannerId)
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['hero-banners'] })
      } else {
        toast.error(result.message || "Erro ao excluir banner.")
      }
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-6 w-1/3 mb-6" />
        </CardContent>
      </Card>
    )
  }
  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar banners</h3>
            <p className="text-muted-foreground">{(error as Error).message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!banners || banners.slides.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 space-y-4">
          <div className="text-center py-12">
            <ImageIcon className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum banner encontrado</h3>
            <p className="text-muted-foreground">Comece criando seu primeiro banner</p>
          </div>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Subtítulo</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowUpDown className="size-4" />
                    Ordem
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.slides.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      className="size-16 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground">{banner.subtitle}</TableCell>
                  <TableCell>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      {banner.link}
                      <ExternalLink className="size-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{banner.order}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch checked={banner.isActive} onCheckedChange={() => handleToggleStatus(banner)} />
                      <Badge variant={banner.isActive ? "default" : "secondary"}>
                        {banner.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <UpdateHeroSlider banner={banner} />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o banner "{banner.title}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(banner.id)}
                              disabled={isPending}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="size-4 mr-2 animate-spin" />
                                  Excluindo...
                                </>
                              ) : (
                                "Excluir"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
