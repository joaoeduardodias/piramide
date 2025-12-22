import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type SortDirection = "asc" | "desc"

export function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="ml-1 size-3 opacity-40" />
  return direction === "asc"
    ? <ArrowUp className="ml-1 size-3" />
    : <ArrowDown className="ml-1 size-3" />
}
