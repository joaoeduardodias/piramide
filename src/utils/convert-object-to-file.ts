export async function convertToFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  const contentType = blob.type || "image/jpeg"
  return new File([blob], fileName, { type: contentType })
}