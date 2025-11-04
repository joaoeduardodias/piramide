"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { GripVertical, Star, Trash2 } from "lucide-react"
import { useState } from "react"

interface ImageGalleryProps {
  images: File[]
  setImages: (images: File[]) => void
}

export default function ImageGallery({ images, setImages }: ImageGalleryProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  const [previewsLoaded, setPreviewsLoaded] = useState(false)
  if (!previewsLoaded && images.length > 0) {
    const newPreviews = images.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)
    setPreviewsLoaded(true)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    setImages(newImages)
    setDraggedIndex(null)

    const newPreviews = newImages.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)

    if (previews[index]) {
      URL.revokeObjectURL(previews[index])
    }

    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Galeria de Imagens</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${draggedIndex === index ? "border-primary bg-primary/10 opacity-50" : "border-border hover:border-primary"
              } ${index === 0 ? "ring-2 ring-primary ring-offset-2" : ""}`}
          >
            <img
              src={previews[index] || "/placeholder.svg"}
              alt={`Imagem ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {index === 0 ? (
                <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                  Principal
                </div>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    const newImages = [...images]
                    const [image] = newImages.splice(index, 1)
                    newImages.unshift(image)
                    setImages(newImages)

                    const newPreviews = [...previews]
                    const [preview] = newPreviews.splice(index, 1)
                    newPreviews.unshift(preview)
                    setPreviews(newPreviews)
                  }}
                  title="Definir como principal"
                >
                  <Star className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Badge de Posição */}
            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <GripVertical className="w-3 h-3" />
              {index + 1}
            </div>

            {/* Botão de Remover */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover imagem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Dica de Reordenação */}
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-foreground">
        <p className="font-medium mb-1">💡 Dica:</p>
        <p className="text-sm text-muted-foreground">
          Arraste as imagens para reordená-las. A primeira imagem será automaticamente definida como imagem principal.
        </p>
      </div>
    </div>
  )
}
