"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const heroSlides = [
  {
    id: 1,
    title: "NOVA COLEÇÃO",
    subtitle: "PRIMAVERA VERÃO",
    description: "Descubra os lançamentos da temporada com estilo e conforto incomparáveis",
    image: "/hero-slide-1.png",
    cta: "Explorar Coleção",
    link: "/",
  },
  {
    id: 2,
    title: "ELEGÂNCIA ATEMPORAL",
    subtitle: "COURO PREMIUM",
    description: "Sapatos artesanais feitos com os melhores materiais para durar uma vida inteira",
    image: "/hero-slide-2.png",
    cta: "Ver Produtos",
    link: "/",
  },
  {
    id: 3,
    title: "PERFORMANCE MÁXIMA",
    subtitle: "LINHA ESPORTIVA",
    description: "Tecnologia de ponta para elevar seu desempenho a outro nível",
    image: "/hero-slide-3.png",
    cta: "Comprar Agora",
    link: "/",
  },
]

interface HeroSectionProps {
  isAuthenticated?: boolean
}


export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <section className="relative h-[500px] overflow-hidden bg-muted md:h-[600px] lg:h-[800px]">

      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover h-[500px] md:h-[600px] lg:h-[800px] w-full"
            priority={index === 0}
            quality={99}

          />

          <div className="absolute inset-0 bg-black/30" />
          <div className="container relative mx-auto flex h-full items-center">
            <div className="max-w-2xl text-white">
              <div className="h-72">
                <p className="mb-2 text-sm font-medium tracking-widest md:text-base">{slide.subtitle}</p>
                <h2 className="mb-4 font-serif text-4xl font-bold text-balance md:text-5xl lg:text-7xl">{slide.title}</h2>
                <p className="mb-8 text-base text-white/90 text-pretty md:text-lg lg:text-xl">{slide.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/products">
                  <Button

                    className="bg-white text-black hover:bg-gray-100 h-14 px-8 text-lg font-semibold shadow-xl"
                  >
                    Explorar Produtos
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button

                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-black h-14 px-8 text-lg font-semibold bg-transparent backdrop-blur-sm"
                  >
                    Ver Categorias
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link href="/auth/sign-in">
                    <Button
                      variant="ghost"
                      className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white h-14 px-6 text-lg backdrop-blur-sm"
                    >
                      <User className="mr-2 size-5" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}


      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 md:left-8"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 md:right-8"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
