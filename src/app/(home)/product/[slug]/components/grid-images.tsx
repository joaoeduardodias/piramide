"use client"
import CFImage from "@/components/cf-image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface GridImagesProps {
  images: {
    id: string;
    url: string;
    alt: string | null;
    fileKey: string | null;
    sortOrder: number;
  }[];
  discount: number
}

export function GridImages({
  images,
  discount
}: GridImagesProps) {
  const initialIndex =
    images.length > 0
      ? images.findIndex((img) => img.sortOrder === Math.min(...images.map((i) => i.sortOrder)))
      : 0

  const [selectedImage, setSelectedImage] = useState<number>(initialIndex)
  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700 text-white text-base px-3 py-1 z-10">
            -{discount}%
          </Badge>
        )}
        <CFImage
          src={images[selectedImage]?.url || "/placeholder.svg"}
          alt={images[selectedImage]?.alt ?? 'Imagem do produto'}
          fill
          className="object-contain"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square cursor-pointer bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
              ? "border-black ring-2 ring-black"
              : "border-transparent hover:border-gray-300"
              }`}
          >
            <CFImage
              src={image?.url || "/placeholder.svg"}
              alt={`${image?.alt} - ${index + 1}`}
              width={120}
              height={120}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  )
}