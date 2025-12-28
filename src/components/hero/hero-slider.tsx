"use client"
import type { HeroBanner } from "@/http/get-hero-banners"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SlideItem } from "./slide-item"



type Props = {
  slides: HeroBanner[]
  isAuth?: boolean
}


export function HeroSlider({ slides: slidesProp, isAuth = false }: Props) {
  const slides = useMemo(() => slidesProp, [slidesProp])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  const goToSlide = useCallback((index: number) => setCurrentSlide(index), [])
  const goToPrevious = useCallback(() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length), [slides.length])
  const goToNext = useCallback(() => setCurrentSlide((prev) => (prev + 1) % slides.length), [slides.length])

  return (
    <>
      {slides.map((slide, index) => (
        <SlideItem isAuthenticated={isAuth} key={slide.id} slide={slide} active={index === currentSlide} priority={index === 0} />
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

      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}