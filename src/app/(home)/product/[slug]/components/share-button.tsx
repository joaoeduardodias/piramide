"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  description: string
  slug: string
}

export function ShareButton({ title, description, slug }: ShareButtonProps) {
  const url = `/product/${slug}`

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title,
        text: description,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      toast("Link copiado para a área de transferência")
    }
  }

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full py-6.5"
      onClick={handleShare}
      aria-label={`Compartilhar ${title}`}
    >
      <Share2 className="size-5 mr-2" />
      Compartilhar
    </Button>
  )
}
