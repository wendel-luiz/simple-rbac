import { type NextFunction, type Request, type Response } from 'express'
import { Exception, InternalServerError } from 'lib/exceptions'
import { formatZodError } from 'utils/format-zod-errors'
import { z } from 'zod'

export function errorHandler(
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
): unknown {
  if (err instanceof Exception) {
    if (err instanceof InternalServerError) {
      console.error(
        `Internal Server Error: Message: ${err.message} Stack: ${err.stack}`,
      )
    }

    return res.status(err.code).json({
      status: err.code,
      message: 'An error has occured.',
      error: err.message,
    })
  }

  if (err instanceof z.ZodError) {
    return res.status(403).json({
      status: 403,
      message: 'A validation error has occured.',
      errors: formatZodError(err),
    })
  }

  console.error(
    `Internal Server Error: Message: ${(err as Error).message} Stack: ${
      (err as Error).stack
    }`,
  )

  return res.status(500).json({
    status: 500,
    message: 'An error has occured.',
    error: 'Internal Server Error',
  })
}
