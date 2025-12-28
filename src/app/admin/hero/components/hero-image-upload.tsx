"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Upload } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"

export interface HeroImage {
  file?: File
  previewUrl: string
  isExisting?: boolean
}

interface HeroImageUploadProps {
  image: HeroImage | null
  setImage: (image: HeroImage | null) => void
}

export function HeroImageUpload({
  image,
  setImage,
}: HeroImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  function handleSelectFile(file: File) {
    if (!file.type.startsWith("image/")) return

    setImage({
      file,
      previewUrl: URL.createObjectURL(file),
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleSelectFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleSelectFile(file)
  }

  function removeImage() {
    if (!image) return

    if (!image.isExisting) {
      URL.revokeObjectURL(image.previewUrl)
    }

    setImage(null)
  }

  return (
    <div className="space-y-4">
      {!image && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary hover:bg-primary/2.5"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-muted">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Arraste a imagem do banner</p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              Selecionar Imagem
            </Button>
          </div>
        </div>
      )}

      {image && (
        <div className="relative aspect-[3/1] rounded-lg overflow-hidden border">
          <Image
            src={image.previewUrl}
            alt="Preview banner"
            fill
            className="object-cover"
            unoptimized
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={removeImage}
            className="absolute top-2 right-2"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
