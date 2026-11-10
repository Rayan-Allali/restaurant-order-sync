import type { Response } from "express"
import { IN_DEVELOPMENT } from "../config/EnvProvider"
import { HttpCodes } from "../config/Errors"
import type { ErrorResponseI, SuccessResponseI } from "../types/response.type"

export function ErrorResponse(
  res: Response,
  code: number,
  errorMessage: string,
  error?: unknown
) {
  console.error('API Error Response', {
    code,
    message: errorMessage,
    error: IN_DEVELOPMENT ? error : 'sanitized'
  })

  let response: ErrorResponseI = {
            status: 'error',
            message: errorMessage,
            code: code,
            error
          }

  if (code === HttpCodes.NotFound.code) {
    response = {
      status: 'error',
      message: `${errorMessage}`,
      code: HttpCodes.NotFound.code,
      error
    }
  }
  res.status(response.code).send(response)
}
export function SuccessResponse(
  res: Response,
  code: number,
  data: unknown,
  message = 'Successful',
  status = 'success',
) {
  const response: SuccessResponseI = {
    status,
    data,
    message,
  }

    res.status(code).send(response)
}