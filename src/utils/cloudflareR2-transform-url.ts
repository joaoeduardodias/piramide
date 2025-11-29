// utils/cfR2TransformUrl.ts
export type CFTransformOpts = {
  width?: number
  height?: number
  quality?: number
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  format?: 'auto' | 'webp' | 'jpeg' | 'png' | 'avif'
}


export function cfR2TransformUrl(
  zoneHostname: string,
  originUrl: string,
  opts: CFTransformOpts = {}
): string {
  const parts: string[] = []
  if (opts.width) parts.push(`width=${opts.width}`)
  if (opts.height) parts.push(`height=${opts.height}`)
  if (opts.quality) parts.push(`quality=${opts.quality}`)
  if (opts.fit) parts.push(`fit=${opts.fit}`)
  if (opts.format) parts.push(`format=${opts.format ?? 'auto'}`)

  const optsStr = parts.join(',')
  return `https://${zoneHostname}/cdn-cgi/image/${optsStr}/${originUrl}`
}
