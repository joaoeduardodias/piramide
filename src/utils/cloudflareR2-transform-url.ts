export type CFTransformOpts = { width?: number; height?: number; quality?: number; fit?: string; format?: string }

export function cfR2TransformUrl(zoneHostname: string, originUrl: string, opts: CFTransformOpts = {}) {
  const parts: string[] = []
  if (opts.width) parts.push(`width=${opts.width}`)
  if (opts.height) parts.push(`height=${opts.height}`)
  if (opts.quality) parts.push(`quality=${opts.quality}`)
  if (opts.fit) parts.push(`fit=${opts.fit}`)
  parts.push(`format=${opts.format ?? 'auto'}`)
  const optsStr = parts.join(',')
  const encodedOrigin = encodeURIComponent(originUrl)
  return `https://${zoneHostname}/cdn-cgi/image/${optsStr}/${encodedOrigin}`
}
