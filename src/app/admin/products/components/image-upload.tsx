"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { AlertCircle, GripVertical, Star, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

interface ImageUploadProps {
  images: File[]
  setImages: (images: File[]) => void
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      setImages([...images, ...imageFiles])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages([...images, ...files])
    }
  }

  const handleDragStartReorder = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOverReorder = (index: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeaveReorder = () => {
    setDragOverIndex(null)
  }

  const handleDropReorder = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    setImages(newImages)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const setAsMainImage = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [image] = newImages.splice(index, 1)
    newImages.unshift(image)
    setImages(newImages)
  }

  const removeAllImages = () => {
    setImages([])
  }

  return (
    <div className="space-y-6">
      {/* Área de Drag and Drop para Upload */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${dragActive
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/30 hover:border-primary hover:bg-primary/2.5"
          }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`p-3 rounded-full ${dragActive ? "bg-primary/20" : "bg-muted"}`}>
            <Upload className={`w-6 h-6 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Arraste imagens aqui</p>
            <p className="text-sm text-muted-foreground">ou clique para selecionar arquivos</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent">
            Selecionar Imagens
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Galeria de Imagens ({images.length})</h3>
              <p className="text-xs text-muted-foreground">Arraste para reordenar. A primeira será a principal.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                draggable
                onDragStart={(e) => handleDragStartReorder(index, e)}
                onDragOver={(e) => handleDragOverReorder(index, e)}
                onDragLeave={handleDragLeaveReorder}
                onDrop={(e) => handleDropReorder(index, e)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move ${dragOverIndex === index
                  ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
                  : "border-border hover:border-primary"
                  } ${draggedIndex === index ? "opacity-50" : ""} ${index === 0 ? "ring-2 ring-primary ring-offset-2" : ""}`}
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  onLoad={(e) => {
                    if (e.currentTarget.src.startsWith("blob:")) {
                      URL.revokeObjectURL(e.currentTarget.src)
                    }
                  }}
                />


                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {index === 0 ? (
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                      <Star className="size-3 fill-current" />
                      Principal
                    </div>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setAsMainImage(index)}
                      title="Definir como principal"
                    >
                      <Star className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <GripVertical className="size-3" />
                  {index + 1}
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover imagem"
                >
                  <Trash2 className="size-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate font-medium">{image.name}</p>
                  <p className="text-xs text-gray-200">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="size-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium">Dica de Reordenação</p>
              <p className="text-muted-foreground">
                Arraste as imagens para reordená-las. A primeira imagem será automaticamente definida como imagem
                principal.
              </p>
            </div>
          </div>
        </div>
      )}


      {images.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm font-medium text-foreground">
            {images.length} imagem{images.length !== 1 ? "s" : ""} selecionada{images.length !== 1 ? "s" : ""}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeAllImages}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4 mr-2" />
            Remover Tudo
          </Button>
        </div>
      )}
    </div>
  )
}
