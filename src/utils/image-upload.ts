export const convertImageToFile = async (imageUrl: string, filename: string): Promise<File> => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  return new File([blob], filename, { type: blob.type })
}

export const compressImage = async (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error("Canvas to Blob conversion failed"))
            }
          },
          "image/jpeg",
          quality,
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"]
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Formato de imagem inválido. Use JPG, PNG ou WebP or Avif.",
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Imagem muito grande. Tamanho máximo: 5MB.",
    }
  }

  return { valid: true }
}
