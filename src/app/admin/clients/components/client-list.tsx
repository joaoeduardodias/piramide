"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState } from "react";
import { ClientFilters } from "./client-filters";
import { ClientListTable } from "./client-list-table";

export const statusConfig = {
  active: { label: "Ativo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
}

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"inactive" | "active" | "all">("all")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  return (
    <>
      <ClientFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}

      />
      <Suspense fallback={<Skeleton className="h-[400px] rounded-md" />}>
        <ClientListTable
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          page={page}
          setPage={setPage}
          search={searchTerm}
          statusFilter={statusFilter}
        />
      </Suspense>
    </>
  )
}