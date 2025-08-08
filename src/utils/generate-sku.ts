
interface SKU {
  id: string;
  category: string;
  model: string;
  color: string;
  size: string;
}

export function generateSKU({ category, model, color, size, id }: SKU): string {
  return (
    id.toString().padStart(3, "0") +
    category.slice(0, 3).toUpperCase() +
    model.slice(0, 3).toUpperCase() +
    color.slice(0, 2).toUpperCase() +
    size
  );
}