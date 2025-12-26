import { Pagination } from "@/components/pagination";
import { SortIcon } from "@/components/sort-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClientsQuery } from "@/hooks/use-clients-query";
import { useDebouncedValue } from "@/hooks/use-debounced-search";
import { useFuseSearch } from "@/hooks/use-fuse-search";
import { formatReal } from "@/lib/validations";
import { useState } from "react";
import { ClientDetails } from "./client-details";
import { statusConfig } from "./client-list";

interface ClientListTableProps {
  search: string
  page: number
  setPage: (v: number) => void
  itemsPerPage: number
  setItemsPerPage: (v: number) => void
}

type SortField = "name" | "orders" | "totalSpent" | "lastOrder"
type SortDirection = "asc" | "desc"

export function ClientListTable({
  search,
  page,
  itemsPerPage,
  setPage,
  setItemsPerPage,
}: ClientListTableProps) {

  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }


  const debouncedSearch = useDebouncedValue(search, 400)
  const shouldSearchOnServer = debouncedSearch.length >= 3
  const { data } = useClientsQuery({
    page,
    limit: itemsPerPage,
    search: shouldSearchOnServer ? debouncedSearch : undefined,
  })

  const totalPages = data?.pagination?.totalPages || 1
  const customers = data?.customers || []

  const { results: fuseResults } = useFuseSearch({
    data: customers,
    search,
    keys: [
      "name",
      "email",
      "phone",
      "cpf",
      "address.city",
      "address.state",
    ],
  })

  const filteredCustomers =
    search && !shouldSearchOnServer
      ? fuseResults
      : customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue: string | number | Date = ""
    let bValue: string | number | Date = ""

    switch (sortField) {
      case "name":
        aValue = (a.name ?? "").toLowerCase()
        bValue = (b.name ?? "").toLowerCase()
        break

      case "orders":
        aValue = a.orders ?? 0
        bValue = b.orders ?? 0
        break

      case "totalSpent":
        aValue = a.totalSpent ?? 0
        bValue = b.totalSpent ?? 0
        break

      case "lastOrder":
        aValue = a.lastOrder ? new Date(a.lastOrder).getTime() : 0
        bValue = b.lastOrder ? new Date(b.lastOrder).getTime() : 0
        break
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
        <CardDescription>{filteredCustomers.length} cliente(s) encontrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>Cliente</span>
                  <SortIcon
                    active={sortField === "name"}
                    direction={sortDirection}
                  />
                </div>
              </TableHead>

              <TableHead className="w-72">
                Localização
              </TableHead>

              <TableHead
                className="cursor-pointer select-none text-right w-18"
                onClick={() => toggleSort("orders")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Pedidos</span>
                  <SortIcon
                    active={sortField === "orders"}
                    direction={sortDirection}
                  />
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none text-right w-28"
                onClick={() => toggleSort("totalSpent")}
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Total Gasto</span>
                  <SortIcon
                    active={sortField === "totalSpent"}
                    direction={sortDirection}
                  />
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none w-44!"
                onClick={() => toggleSort("lastOrder")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>Último Pedido</span>
                  <SortIcon
                    active={sortField === "lastOrder"}
                    direction={sortDirection}
                  />
                </div>
              </TableHead>

              <TableHead className="w-36">Status</TableHead>
              <TableHead className="w-14">Ações</TableHead>
            </TableRow>

          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{customer.city}</p>
                    <p className="text-sm text-gray-500">{customer.state}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-blue-600">{customer.orders}</TableCell>
                <TableCell className="font-medium text-green-600">{formatReal(String(customer.totalSpent))}</TableCell>
                <TableCell>{new Date(customer.lastOrder).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge className={statusConfig[customer.status as keyof typeof statusConfig].color}>{statusConfig[customer.status as keyof typeof statusConfig].label}</Badge>
                </TableCell>
                <TableCell>
                  <ClientDetails customer={customer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={page}
          itemsPerPage={itemsPerPage}
          setPage={(p) => setPage(p)}
          setItemsPerPage={(l) =>
            setItemsPerPage(l)
          }
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  )
}