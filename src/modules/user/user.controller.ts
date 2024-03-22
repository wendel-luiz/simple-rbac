import express, { type Router } from 'express'
import { paramParser } from 'middleware/param-parser'
import { bodyParser } from 'middleware/body-parser'
import { UserHandler } from './user.handlers'
import {
  createUserBodySchema,
  createUserParamSchema,
} from './commands/dtos/create-user.dto'
import { getUserByIdParamsSchema } from './queries/dtos/get-by-id.dto'
import { loginBodySchema } from './commands/dtos/login.dto'
import { validateTokenBodySchema } from './commands/dtos/validate-token.dto'

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

    this._router.get(
      '/:userId',
      paramParser(getUserByIdParamsSchema),
      this._handler.getUserById,
    )

    this._router.post(
      '/login',
      bodyParser(loginBodySchema),
      this._handler.loginUser,
    )

    this._router.put(
      '/validate-token',
      bodyParser(validateTokenBodySchema),
      this._handler.validateTokenUser,
    )
  }
}
