import { type Router } from 'express'
import { paramParser } from 'middleware/param-parser'
import { bodyParser } from 'middleware/body-parser'
import { type UserHandler } from './user.handler'
import {
  createUserBodySchema,
  createUserParamSchema,
} from './dtos/create-user.dto'
import { getUserByIdParamsSchema } from './dtos/get-by-id.dto'
import { loginBodySchema } from './dtos/login.dto'
import { validateTokenBodySchema } from './dtos/validate-token.dto'

export class UserController {
  constructor(
    private readonly _handler: UserHandler,
    private readonly _router: Router,
  ) {
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

  public getRouter(): Router {
    return this._router
  }
}
