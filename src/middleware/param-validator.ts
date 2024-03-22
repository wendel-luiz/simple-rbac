import { type NextFunction, type Request, type Response } from 'express'
import { type ZodSchema } from 'zod'

export function ParamValidator(paramSchema: ZodSchema) {
  return function validator(req: Request, res: Response, next: NextFunction) {
    const parsed = paramSchema.parse(req.params)
    req.params = parsed
    next()
  }
}
