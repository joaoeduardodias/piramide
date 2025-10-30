export interface AddressData {
  postalCode: string
  street: string
  complement: string
  district: string
  city: string
  state: string
  error?: boolean
}

export async function fetchAddressByCEP(postalCode: string): Promise<AddressData | null> {
  try {
    const cleanPostalCode = postalCode.replace(/\D/g, "")
    if (cleanPostalCode.length !== 8) return null

    const response = await fetch(`https://viacep.com.br/ws/${cleanPostalCode}/json/`)
    if (!response.ok) return null

    const data = await response.json()
    if (data.erro) return null

    return data
  } catch (error) {
    console.error("Error fetching postal code:", error)
    return null
  }
}
