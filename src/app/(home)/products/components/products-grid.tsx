
import { Product } from "@/components/product"
import { ProductType } from "@/http/get-products"

interface ProductsGridProps {
  products: ProductType[]
  viewMode: "grid" | "list"
}

export function ProductsGrid({ products, viewMode }: ProductsGridProps) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  gap-6"
          : "space-y-6"
      }
    >
      {products.map((product) => (
        <div
          key={product.id}
          className={
            viewMode === "grid"
              ? "w-full max-w-[320px] justify-self-center"
              : ""
          }
        >
          <Product product={product} viewMode={viewMode} />
        </div>
      ))}
    </div>
  )
}
