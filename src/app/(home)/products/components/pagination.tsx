"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-end items-center gap-2 mt-12">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1
        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className="w-10 h-10"
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  )
}
