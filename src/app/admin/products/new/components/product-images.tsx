"use client"

import { AlertCircle } from "lucide-react"
import ImageUpload, { type ImageItem } from "../../components/image-upload"

interface ProductImagesProps {
  images: ImageItem[]
  setImages: (images: ImageItem[]) => void
  errors?: Record<string, string[]> | null
}

export function ProductImages({ images, setImages, errors }: ProductImagesProps) {
  return (
    <>
      <ImageUpload images={images} setImages={setImages} />
      {errors?.images && (
        <p className="text-sm text-red-600 mt-2 flex gap-1">
          <AlertCircle size={16} />
          {errors.images[0]}
        </p>
      )}
    </>
  )
}
