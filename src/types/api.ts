export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

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
