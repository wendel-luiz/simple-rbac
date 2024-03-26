import { type Router } from 'express'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'
import { type RoleHandler } from './role.handler'
import { createRoleBodySchema } from './dtos/create-role.dto'
import { getRoleByIdParamsSchema } from './dtos/get-by-id'
import { addUserBodySchema, addUserParamSchema } from './dtos/add-user.dto'
import {
  addPermissionBodySchema,
  addPermissionParamSchema,
} from './dtos/add-permission.dto'

export class RoleController {
  constructor(
    private readonly _handler: RoleHandler,
    private readonly _router: Router,
  ) {
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

    this._router.post(
      '/:roleId/add-user',
      paramParser(addUserParamSchema),
      bodyParser(addUserBodySchema),
      this._handler.addUser,
    )

    this._router.post(
      '/:roleId/add-permission',
      paramParser(addPermissionParamSchema),
      bodyParser(addPermissionBodySchema),
      this._handler.addPermission,
    )

    this._router.get(
      '/:roleId',
      paramParser(getRoleByIdParamsSchema),
      this._handler.getRoleById,
    )
  }
}
