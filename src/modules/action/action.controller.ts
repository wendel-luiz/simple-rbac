import express, { type Router } from 'express'
import { type ActionHandler } from './action.handler'
import { createActionBodySchema } from './dtos/create-action.dto'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'
import { getActionByIdParamsSchema } from './dtos/get-by-id.dto'

export class ActionController {
  private readonly _router: Router

  constructor(private readonly _handler: ActionHandler) {
    this._router = express.Router()
    this._router.post(
      '/tenant/:tenantId',
      bodyParser(createActionBodySchema),
      this._handler.createAction,
    )

    this._router.get(
      '/:actionId',
      paramParser(getActionByIdParamsSchema),
      this._handler.getActionById,
    )
  }

  public getRouter(): Router {
    return this._router
  }
}
