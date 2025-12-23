"use client"

import { Button } from "@/components/ui/button"
import { GripVertical, Star, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"

export interface ImageItem {
  id?: string // ID do banco de dados (para imagens existentes)
  file?: File // Objeto File (para novas imagens)
  url: string // URL para preview (local ou remota)
  isNew: boolean // Flag para novas imagens
  fileKey?: string | null // Chave do arquivo no storage (para imagens existentes)
}

interface ImageUploadProps {
  images: ImageItem[]
  setImages: (images: ImageItem[]) => void
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // — Upload area
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length > 0) {
      const newItems: ImageItem[] = imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        isNew: true,
      }))
      setImages([...images, ...newItems])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const imageFiles = files.filter((f) => f.type.startsWith("image/"))
    const newItems: ImageItem[] = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }))
    setImages([...images, ...newItems])
  }

  // — Reorder handlers
  const handleDragStartReorder = (index: number, e: React.DragEvent) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOverReorder = (index: number, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDropReorder = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return
    const items = [...images]
    const [dragged] = items.splice(draggedIndex, 1)
    items.splice(targetIndex, 0, dragged)
    setImages(items)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // — Actions (remove, set main, remove all)
  const removeImage = (index: number) => {
    const imageToRemove = images[index]
    // Revoga a URL temporária para evitar memory leak, se for um arquivo novo
    if (imageToRemove.isNew && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    setImages(images.filter((_, i) => i !== index))
  }

  const setAsMainImage = (index: number) => {
    if (index === 0) return
    const items = [...images]
    const [img] = items.splice(index, 1)
    items.unshift(img)
    setImages(items)
  }

  const removeAllImages = () => {
    images.forEach((img) => {
      if (img.isNew && img.url) {
        URL.revokeObjectURL(img.url)
      }
    })
    setImages([])
  }

  return (
    <div className="space-y-6">
      {/* Upload & Drag Area */}
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

      {/* Images Preview */}
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.url + (image.fileKey || index)} // Chave mais robusta
                draggable
                onDragStart={(e) => handleDragStartReorder(index, e)}
                onDragOver={(e) => handleDragOverReorder(index, e)}
                onDrop={(e) => handleDropReorder(index, e)}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-move transition-all ${dragOverIndex === index
                    ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
                    : "border-border hover:border-primary"
                  }`}
              >
                <Image src={image.url} alt={`Imagem ${index + 1}`} fill className="object-cover" unoptimized />

                {/* Main / Set as Main */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
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
                    >
                      <Star className="size-4" />
                    </Button>
                  )}
                </div>

                {/* Order label */}
                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <GripVertical className="size-3" /> {index + 1}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
            <span className="text-sm font-medium text-foreground">
              {images.length} imagem{images.length !== 1 && "s"} selecionada{images.length !== 1 && "s"}
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
        </>
      )}
    </div>
  )
}
