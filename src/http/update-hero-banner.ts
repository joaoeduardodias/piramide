import { api } from "./api-client";



interface UpdateHeroBannerRequest {
  id: string
  cta?: string;
  description?: string | null;
  image?: string;
  isActive?: boolean;
  link?: string;
  order?: number;
  subtitle?: string | null;
  title?: string | null;
}

export async function updateHeroBanner({
  id,
  cta,
  description,
  image,
  isActive,
  link,
  order,
  subtitle,
  title
}: UpdateHeroBannerRequest) {
  const result = await api.put(`hero-slide/${id}`, {
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
