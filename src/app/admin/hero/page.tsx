import { CreateHeroBanner } from "./components/create-hero-slider"
import { HeroBannersTable } from "./components/hero-banners-table"

export const metadata = {
  title: "Hero Banner | Dashboard",
  description: "Gerencie seus banners hero.",
}

export default function HeroPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Banner</h1>
          <p className="text-muted-foreground">
            Gerencie seus banners hero.
          </p>
        </div>
        <CreateHeroBanner />
      </div>
      <HeroBannersTable />
    </div>
  )
}
