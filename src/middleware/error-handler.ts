import { type NextFunction, type Request, type Response } from 'express'
import { Exception, InternalServerError } from 'lib/exceptions'
import { z } from 'zod'

export function ErrorHandlerMiddleware(
  err: unknown,
  req: Request,
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
      message: 'A validation has occured.',
      errors: err.errors.map((error) => ({
        [error.path.join('/')]: error.message,
      })),
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
