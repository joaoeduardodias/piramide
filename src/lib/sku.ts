function normalizeSkuSegment(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase()
}

function shortHash(input: string, length = 6): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  const base36 = (hash >>> 0).toString(36).toUpperCase()
  return base36.padStart(length, "0").slice(0, length)
}

export function getProductSkuBase(productName: string): string {
  const trimmed = (productName ?? "").trim()
  if (!trimmed) return ""
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function generateVariantSku({
  productName,
  optionValues,
  optionValueIds,
  prefix,
}: {
  productName: string
  optionValues: string[]
  optionValueIds?: string[]
  prefix?: string
}): string {
  const base = prefix ?? getProductSkuBase(productName)
  const normalizedValues = optionValues.map(normalizeSkuSegment).filter(Boolean)
  const optionKey =
    optionValueIds && optionValueIds.length > 0
      ? [...optionValueIds].sort().join("|")
      : normalizedValues.join("|")

  const hash = shortHash(`${productName}|${optionKey}`)
  return [base, ...normalizedValues, hash].filter(Boolean).join("-").toUpperCase()
}
