
import { parseCookies } from "nookies"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"

export interface FetchOptions extends RequestInit {
  revalidate?: number | false
  tags?: string[]
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")

  let data: any = {}
  if (contentType?.includes("application/json")) {
    data = await response.json().catch(() => ({}))
  } else {
    data = await response.text().catch(() => "")
  }

  if (!response.ok) {
    throw new ApiError(response.status, data?.message || "Erro na requisição", data)
  }

  return data as T
}

function getAuthHeaders(): HeadersInit {
  const cookies = parseCookies()
  const token = cookies["token"]

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function apiRequest<T>(
  endpoint: string,
  method: string,
  body?: any,
  options?: FetchOptions,
): Promise<T> {
  const { revalidate, tags, ...fetchOptions } = options || {}

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: method === "GET" ? (revalidate === false ? "no-store" : "force-cache") : "no-store",
    next: {
      revalidate: method === "GET" ? revalidate : undefined,
      tags,
    },
    ...fetchOptions,
  })

  return handleResponse<T>(response)
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiRequest<T>(endpoint, "GET", undefined, options),

  post: <T>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiRequest<T>(endpoint, "POST", data, options),

  put: <T>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiRequest<T>(endpoint, "PUT", data, options),

  patch: <T>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiRequest<T>(endpoint, "PATCH", data, options),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiRequest<T>(endpoint, "DELETE", undefined, options),

  postFormData: async <T>(endpoint: string, formData: FormData, options?: FetchOptions) => {
    const cookies = parseCookies()
    const token = cookies["token"]

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      cache: "no-store",
      ...options,
    })

    return handleResponse<T>(response)
  },
}
