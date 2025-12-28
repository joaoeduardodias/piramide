import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";


export interface HeroBanner {
  link: string;
  title: string;
  description: string;
  subtitle: string;
  image: string;
  cta: string;
  order: number;
  isActive: boolean;
  id: string;
}


export interface GetHeroBanner {
  slides: HeroBanner[];

}

export async function getHeroBanner() {
  const result = await api.get('hero-slides', { next: { tags: ['hero-banners'] } }).json<GetHeroBanner>()
  return result
}


export function useHeroBanners() {
  return useQuery({
    queryKey: ['hero-banners'],
    queryFn: () => getHeroBanner(),
  }
  )
}