import express, { type Router } from 'express'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'
import { RoleHandler } from './role.handler'
import { createRoleBodySchema } from './command/dtos/create-role.dto'
import { getRoleByIdParamsSchema } from './query/dtos/get-by-id'

export class RoleController {
  private readonly _handler: RoleHandler
  private readonly _router: Router

  constructor() {
    this._handler = new RoleHandler()
    this._router = express.Router()
    this.buildRoutes()
  }

  public getRouter(): Router {
    return this._router
  }

  private buildRoutes(): void {
    this._router.post(
      '/tenant/:tenantId',
      bodyParser(createRoleBodySchema),
      this._handler.createRole,
    )

    this._router.get(
      '/:roleId',
      paramParser(getRoleByIdParamsSchema),
      this._handler.getRoleById,
    )
  }
}
