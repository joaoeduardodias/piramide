import { auth } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";


function getInitials(name: string): string {
  if (!name.trim()) return "";

  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");

  return initials;
}


export async function ProfileButton() {

  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
          <span className="hidden sm:block text-xs font-medium text-muted-foreground">{user.email}</span>
        </div>
        <Avatar className="size-8">
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <ChevronDown className="ml-1 size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-center">Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 size-4" />
          Meu Perfil
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Settings className="mr-2 size-4" />
          Configurações
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-red-600 cursor-pointer">
          <Link href="/api/auth/sign-out" >
            <LogOut className="mr-2 size-4" />
            Sair
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}