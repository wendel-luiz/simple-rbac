import { type Request, type Response } from 'express'

export function responseHandler(_: Request, res: Response): void {
  res.json({
    status: res.statusCode,
    message: 'success',
    data: res.locals ?? undefined,
  })
}
