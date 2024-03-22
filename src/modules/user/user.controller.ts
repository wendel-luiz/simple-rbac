import express, { type Router } from 'express'
import { createUserBodySchema, createUserParamSchema } from './user.types'
import { paramParser } from 'middleware/param-parser'
import { bodyParser } from 'middleware/body-parser'
import { UserHandler } from './user.handlers'

export class UserController {
  private readonly _router: Router
  private readonly _handler: UserHandler

  constructor() {
    this._router = express.Router()
    this._handler = new UserHandler()

    this.buildRoutes()
  }

  public getRouter(): Router {
    return this._router
  }

  private buildRoutes(): void {
    this._router.post(
      '/tenant/:tenantId',
      paramParser(createUserParamSchema),
      bodyParser(createUserBodySchema),
      this._handler.createUser,
    )
  }
}
