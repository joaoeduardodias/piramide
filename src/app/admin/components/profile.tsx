import { auth } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getInitials(name: string): string {
  if (!name.trim()) return "";

  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");

  return initials;
}

export async function Profile() {
  const { user } = await auth()
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <Avatar className="size-8">
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  )
}