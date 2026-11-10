import { IN_DEVELOPMENT } from "../config/EnvProvider"
import { HttpCodes } from "../config/Errors"
import { Request, Response } from 'express'


export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number
  ) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
export function errorMiddleware(error: AppError, _req: Request, res: Response) {
  const status = error.statusCode || HttpCodes.InternalServerError.code
  const message = error.message || HttpCodes.InternalServerError.message
  const errorDetails = IN_DEVELOPMENT ? error : undefined

  res.status(status).json({
    status,
    message,
    error: errorDetails,
  })
}