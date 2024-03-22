import express, { type Router } from 'express'
import { ActionHandler } from './action.handler'
import { createActionBodySchema } from './command/dtos/create-action.dto'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'
import { getActionByIdParamsSchema } from './query/dtos/get-by-id.dto'

export class ActionController {
  private readonly _handler: ActionHandler
  private readonly _router: Router

  constructor() {
    this._handler = new ActionHandler()
    this._router = express.Router()
    this.buildRoutes()
  }

  public getRouter(): Router {
    return this._router
  }

  private buildRoutes(): void {
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
}
