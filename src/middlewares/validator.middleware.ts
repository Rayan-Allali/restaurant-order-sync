import type { NextFunction,Response,Request } from "express"
import { IN_DEVELOPMENT } from "../config/EnvProvider"
import { HttpCodes, ExitCodes  } from "../config/Errors"
import { validationResult } from 'express-validator'
import { ErrorResponse } from "../utils/response"

export function handleValidationErrors(req: Request, res: Response) {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return false
  }

  errors.array().forEach((error) => {
    console.error('Validation error', {
      error: IN_DEVELOPMENT ? error : 'sanitized',
      middleware: 'validator',
    })
  })

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(', ')

  const errorMessage = ExitCodes.ERROR_INVALID_INPUT.message.replace('{input}', errorMessages)

  ErrorResponse(res, HttpCodes.BadRequest.code, errorMessage, ExitCodes.ERROR_INVALID_INPUT.type)

  return true
}
export async function validatorMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const isInvalid = handleValidationErrors(req, res)
    if (isInvalid) return
    next()
  } catch (error: unknown) {
    console.error('Validator middleware error', {
      error: IN_DEVELOPMENT ? error : 'sanitized',
      middleware: 'validator',
    })
    return ErrorResponse(
      res,
      HttpCodes.InternalServerError.code,
      'something went wrong',
      `something went wrong error : ${(error as Error).message}`
    )
  }
}