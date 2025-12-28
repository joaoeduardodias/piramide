import type { HeroBanner } from "@/http/get-hero-banners"
import { ArrowRight, User } from "lucide-react"
import Link from "next/link"
import CFImage from "../cf-image"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"



export function SlideItem({ slide, active, priority, isAuthenticated }: { slide: HeroBanner; active: boolean; priority?: boolean; isAuthenticated: boolean; }) {
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      role="group"
    >
      <CFImage
        src={slide.image}
        alt={slide.title}
        fill
        className="object-cover h-[500px] md:h-[600px] lg:h-[800px] w-full"
        priority={priority}
        quality={99}
      />

      <div className="absolute inset-0 bg-black/30" />
      <div className="container relative mx-auto flex h-full items-center px-4">
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <div className="max-w-2xl text-white">
              <div className="h-72">
                <p className="mb-2 text-sm font-medium tracking-widest md:text-base">{slide.subtitle}</p>
                <h2 className="mb-4 font-serif text-4xl font-bold text-balance md:text-5xl lg:text-7xl">{slide.title}</h2>
                <p className="mb-8 text-base text-white/90 text-pretty md:text-lg lg:text-xl">{slide.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link href="/products">
                  <Button className="bg-white text-black hover:bg-gray-100 h-14 px-8 text-lg font-semibold shadow-xl">
                    Explorar Produtos
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>

                <Link href="/categories">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black h-14 px-8 text-lg font-semibold bg-transparent backdrop-blur-sm">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}