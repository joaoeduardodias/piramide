"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";



interface ClientFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: "inactive" | "active" | "all";
  setStatusFilter: (filter: "inactive" | "active" | "all") => void;
}

export function ClientFilters({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: ClientFiltersProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "inactive" | "active" | "all")}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}