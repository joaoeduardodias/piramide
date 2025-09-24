"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Product } from "@/components/product"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { isNewProduct } from "@/utils/count-hours-create-product"
import { products } from "@/utils/products"
import { ArrowUpDown, Filter, Grid3X3, List, Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"


const categories = ["Todos", "Tênis", "Social", "Botas", "Sandálias"]
const brands = ["Todas", "Nike", "Adidas", "Vans", "Democrata", "Via Marte", "Havaianas", "Ferracini", "Kildare"]
const colors = ["Todas", "Preto", "Branco", "Marrom", "Cinza", "Azul", "Bege"]
const sizes = ["Todos", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedBrand, setSelectedBrand] = useState("Todas")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "Todas" || product.brand === selectedBrand
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesColors = selectedColors.length === 0 || selectedColors.some((color) => product.colors.some((c) => c.name === color))
    const matchesSizes = selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes.includes(size))

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesColors && matchesSizes
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return 2 * Number(isNewProduct(b.createdAt)) - 2 * Number(isNewProduct(a.createdAt))
      case "discount":
        return b.discount - a.discount
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color])
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    }
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size])
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    }
  }

  const clearFilters = () => {
    setSelectedCategory("Todos")
    setSelectedBrand("Todas")
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([0, 500])
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-black to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200&text=Products+Hero')] bg-cover bg-center opacity-20" />

        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Mais de 500 produtos disponíveis
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Nossa Coleção
              </span>
              <span className="block bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                Completa
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubra os melhores calçados com qualidade premium, design moderno e preços que cabem no seu bolso.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filtros
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-black">
                    Limpar
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Categoria</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={selectedCategory === category}
                            onCheckedChange={() => setSelectedCategory(category)}
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Marca</h4>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">
                      Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                    </h4>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                  </div>

                  {/* Colors Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Cores</h4>
                    <div className="space-y-2">
                      {colors.slice(1).map((color) => (
                        <label key={color} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={selectedColors.includes(color)}
                            onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                          />
                          <span className="text-sm">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sizes Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Tamanhos</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {sizes.slice(1).map((size) => (
                        <label key={size} className="flex items-center space-x-1 cursor-pointer">
                          <Checkbox
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                          />
                          <span className="text-xs">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <p className="text-gray-600">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-low">Menor preço</SelectItem>
                    <SelectItem value="price-high">Maior preço</SelectItem>
                    <SelectItem value="rating">Melhor avaliação</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="discount">Maior desconto</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedColors.length > 0 ||
              selectedSizes.length > 0 ||
              selectedCategory !== "Todos" ||
              selectedBrand !== "Todas") && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "Todos" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("Todos")} />
                    </Badge>
                  )}
                  {selectedBrand !== "Todas" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {selectedBrand}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand("Todas")} />
                    </Badge>
                  )}
                  {selectedColors.map((color) => (
                    <Badge key={color} variant="secondary" className="flex items-center gap-1">
                      {color}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleColorChange(color, false)} />
                    </Badge>
                  ))}
                  {selectedSizes.map((size) => (
                    <Badge key={size} variant="secondary" className="flex items-center gap-1">
                      Tam. {size}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleSizeChange(size, false)} />
                    </Badge>
                  ))}
                </div>
              )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {paginatedProducts.map((product) => (
                  <Product key={product.id} {...product} />
                  // <Card
                  //   key={product.id}
                  //   className={`group hover:shadow-xl transition-all duration-300 ${viewMode === "list" ? "flex flex-row" : ""
                  //     }`}
                  // >
                  //   <CardContent className="p-0">
                  //     <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  //       <Link href={`/produto/${product.id}`}>
                  //         <Image
                  //           src={product.images[0] || "/placeholder.svg"}
                  //           alt={product.name}
                  //           width={300}
                  //           height={300}
                  //           className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "w-48 h-48" : "w-full h-64"
                  //             }`}
                  //         />
                  //       </Link>
                  //       <div className="absolute top-4 left-4 flex flex-col gap-2">
                  //         {isNewProduct(product.createdAt) && <Badge className="bg-green-500 hover:bg-green-600 text-white">Novo</Badge>}
                  //         {product.discount > 0 && (
                  //           <Badge className="bg-red-500 hover:bg-red-600 text-white">-{product.discount}%</Badge>
                  //         )}
                  //       </div>
                  //       <Button
                  //         variant="ghost"
                  //         size="icon"
                  //         className="absolute top-4 right-4 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  //       >
                  //         <Heart className="w-4 h-4" />
                  //       </Button>
                  //     </div>

                  //     <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  //       {/* <div className="flex items-center gap-1 mb-2">
                  //         <div className="flex">
                  //           {[...Array(5)].map((_, i) => (
                  //             <Star
                  //               key={i}
                  //               className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  //                 }`}
                  //             />
                  //           ))}
                  //         </div>
                  //         <span className="text-sm text-gray-600">({product.reviews})</span>
                  //       </div> */}

                  //       <Link href={`/produto/${product.id}`}>
                  //         <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                  //           {product.name}
                  //         </h3>
                  //       </Link>

                  //       <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                  //       <div
                  //         className={`flex items-center ${viewMode === "list" ? "justify-between" : "justify-between"}`}
                  //       >
                  //         <div className="flex items-center gap-2">
                  //           <span className="text-xl font-bold text-gray-900">
                  //             R$ {product.price.toFixed(2).replace(".", ",")}
                  //           </span>
                  //           {product.originalPrice > product.price && (
                  //             <span className="text-sm text-gray-500 line-through">
                  //               R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  //             </span>
                  //           )}
                  //         </div>
                  //         <AddToCartButton
                  //           product={{
                  //             id: product.id,
                  //             name: product.name,
                  //             price: product.price,
                  //             originalPrice: product.originalPrice,
                  //             images: product.images,
                  //             category: product.category,
                  //             discount: product.discount,
                  //           }}
                  //           selectedSize=""
                  //           selectedColor="Padrão"
                  //           size="sm"
                  //           disabled={true}
                  //         />
                  //       </div>
                  //     </div>
                  //   </CardContent>
                  // </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros ou buscar por outros termos</p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar filtros
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-10 h-10"
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
