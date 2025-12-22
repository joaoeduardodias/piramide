import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Pagination as PaginationRoot } from "./ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export interface PaginationProps {
  page: number
  totalPages: number
  itemsPerPage: number
  setPage: (page: number) => void
  setItemsPerPage: (page: number) => void
}


function getVisiblePages(current: number, total: number) {
  const pages: (number | "ellipsis")[] = []

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  pages.push(1)

  if (current > 3) {
    pages.push("ellipsis")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push("ellipsis")
  }

  pages.push(total)

  return pages
}


export function Pagination({ page, setPage, totalPages, itemsPerPage, setItemsPerPage }: PaginationProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4 w-full">
      <Select
        value={String(itemsPerPage)}
        onValueChange={(value) => {
          setItemsPerPage(Number(value))
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Itens por página" />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 30, 50].map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n} por página
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <PaginationRoot className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href=""
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
            />
          </PaginationItem>

          {getVisiblePages(page, totalPages).map((item, index) => {
            if (item === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={item}>
                <PaginationLink
                  href=""
                  isActive={page === item}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(item)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href=""
              aria-disabled={page === totalPages}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>

    </div>

  )
}