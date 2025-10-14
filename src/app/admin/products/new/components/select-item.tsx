
import {
  Select,
  SelectContent,
  SelectItem as SelectItemShadCn,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories } from "@/http/get-categories"

export interface SelectItemProps {
  errors?: boolean
}

export async function SelectItem({ errors = false }: SelectItemProps) {
  const categories = await getCategories()
  return (
    <Select name="category">
      <SelectTrigger className={`mt-2 ${errors ? "border-red-500" : ""}`}>
        <SelectValue placeholder={`Selecione uma categoria`} />
      </SelectTrigger>

      <SelectContent>
        {categories.map((item) => (
          <SelectItemShadCn key={item.id} value={item.name.toLowerCase()}>
            {item.name}
          </SelectItemShadCn>
        ))}
      </SelectContent>
    </Select>
  )
}
