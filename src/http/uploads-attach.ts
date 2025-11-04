import { api } from "./api-client";

interface Uploads {
  fileKey: string,
  url: string,
  sortOrder: number,
}

interface UploadsAttachRequest {
  productId: string,
  files: Uploads[]
}


export async function uploadsAttach({ files, productId }: UploadsAttachRequest) {
  const result = await api.post('uploads/attach', { json: { productId, files } })

  return result
}