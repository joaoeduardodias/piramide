import { isAuthenticated } from "@/auth/auth"
import { getHeroBanner } from "@/http/get-hero-banners"
import { HeroSlider } from "./hero-slider"

export default async function HeroSection() {
  const isAuth = await isAuthenticated()
  const { slides } = await getHeroBanner()

  return (
    <section className="relative h-[500px] overflow-hidden bg-muted md:h-[600px] lg:h-[800px]">
      <HeroSlider slides={slides} isAuth={isAuth} />
    </section>
  )
}
