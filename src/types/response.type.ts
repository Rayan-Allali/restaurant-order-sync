export interface ResponseI {
  status: string
  message: string
  data?: unknown
  error?: unknown
  code?: number
}

export type ResponseT = ErrorResponseI | SuccessResponseI

export interface SuccessResponseI {
  status: string
  data: unknown
  message: string
}

export type SuccessResponseT = SuccessResponseI

export interface ErrorResponseI {
  status: string
  message: string
  code: number
  error: unknown
}

export type ErrorResponseT = ErrorResponseI
