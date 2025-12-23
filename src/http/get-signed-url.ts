import { api } from "./api-client";


interface getSignedUrlRequest {
  files: {
    fileName: string;
    contentType: string;
    sortOrder: number;
  }[]
}
interface getSignedUrlResponse {
  uploads: {
    fileKey: string;
    presignedUrl: string;
    url: string;
    contentType: string
  }[]
}

export async function getSignedUrl({ files }: getSignedUrlRequest) {
  const result = await api.post('uploads', { json: { files } }).json<getSignedUrlResponse>()
  return result
}





