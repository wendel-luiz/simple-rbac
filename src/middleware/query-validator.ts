import { type NextFunction, type Request, type Response } from 'express'
import { type ZodSchema } from 'zod'

export function QueryValidator(querySchema: ZodSchema) {
  return function validator(req: Request, res: Response, next: NextFunction) {
    const parsed = querySchema.parse(req.query)
    req.query = parsed
    next()
  }
}
