import { isAuthenticated } from "@/auth/auth"
import { HeroSlider } from "./hero-slider"

type Slide = {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  link: string
}

const HERO_SLIDES: Slide[] = [
  { id: 1, title: "NOVA COLEÇÃO", subtitle: "PRIMAVERA VERÃO", description: "Descubra os lançamentos da temporada com estilo e conforto incomparáveis", image: "/hero-slide-1.png", cta: "Explorar Coleção", link: "/" },
  { id: 2, title: "ELEGÂNCIA ATEMPORAL", subtitle: "COURO PREMIUM", description: "Sapatos artesanais feitos com os melhores materiais para durar uma vida inteira", image: "/hero-slide-2.png", cta: "Ver Produtos", link: "/" },
  { id: 3, title: "PERFORMANCE MÁXIMA", subtitle: "LINHA ESPORTIVA", description: "Tecnologia de ponta para elevar seu desempenho a outro nível", image: "/hero-slide-3.png", cta: "Comprar Agora", link: "/" },
]


export default async function HeroSection() {
  const isAuth = await isAuthenticated()

  return (
    <section className="relative h-[500px] overflow-hidden bg-muted md:h-[600px] lg:h-[800px]">
      <HeroSlider slides={HERO_SLIDES} isAuth={isAuth} />
    </section>
  )
}
