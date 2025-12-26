import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/http/get-customers";
import { formatReal } from "@/lib/validations";
import { Eye } from "lucide-react";
import { statusConfig } from "./client-list";

interface ClientDetailsProps {
  customer: Customer
}

export function ClientDetails({ customer }: ClientDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Perfil do Cliente</DialogTitle>
          <DialogDescription>Informações detalhadas do cliente</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Nome</Label>
              <p className="text-gray-900">{customer.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Telefone</Label>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Localização</Label>
              <p className="text-gray-900">
                {customer.city}, {customer.state}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Data de Cadastro</Label>
              <p className="text-gray-900">
                {new Date(customer.joinDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Badge className={statusConfig[customer.status as keyof typeof statusConfig].color}>
                {statusConfig[customer.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{customer.orders}</p>
              <p className="text-sm text-gray-600">Pedidos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatReal(String(customer.totalSpent))}</p>
              <p className="text-sm text-gray-600">Total Gasto</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatReal(String(customer.totalSpent / customer.orders))}
              </p>
              <p className="text-sm text-gray-600">Ticket Médio</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}