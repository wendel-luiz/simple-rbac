import { type NextFunction, type Request, type Response } from 'express'
import { type ZodSchema } from 'zod'

export function BodyValidator(bodySchema: ZodSchema) {
  return function validator(req: Request, res: Response, next: NextFunction) {
    const parsed = bodySchema.parse(req.body)
    req.body = parsed
    next()
  }
}
