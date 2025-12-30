import { api } from "./api-client";



interface CreateHeroBannerRequest {
  cta: string;
  description?: string | null;
  image: string;
  isActive: boolean;
  link: string;
  order: number;
  subtitle?: string | null;
  title?: string | null;
}

export async function createHeroBanner({
  cta,
  description,
  image,
  isActive,
  link,
  order,
  subtitle,
  title
}: CreateHeroBannerRequest) {
  const result = await api.post('hero-slide', {
    json: {
      cta,
      description,
      image,
      isActive,
      link,
      order,
      subtitle,
      title
    }
  }).json()
  return result
}
