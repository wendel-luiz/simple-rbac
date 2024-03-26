import express, { type Router } from 'express'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'
import { type RoleHandler } from './role.handler'
import {
  createRoleBodySchema,
  createRoleParamSchema,
} from './dtos/create-role.dto'
import { getRoleByIdParamsSchema } from './dtos/get-by-id'
import { addUserBodySchema, addUserParamSchema } from './dtos/add-user.dto'
import {
  addPermissionBodySchema,
  addPermissionParamSchema,
} from './dtos/add-permission.dto'
import {
  removeUserBodySchema,
  removeUserParamSchema,
} from './dtos/remove-user.dto'
import {
  removePermissionBodySchema,
  removePermissionParamSchema,
} from './dtos/remove-permission.dto'
import { queryParser } from 'middleware/query-parser'
import { getUsersParamsSchema, getUsersQuerySchema } from './dtos/get-users.dto'
import {
  getPermissionsParamsSchema,
  getPermissionsQuerySchema,
} from './dtos/get-permissions.dto'

export class RoleController {
  private readonly _router: Router

  constructor(private readonly _handler: RoleHandler) {
    this._router = express.Router()

    this._router.post(
      '/tenant/:tenantId',
      bodyParser(createRoleBodySchema),
      paramParser(createRoleParamSchema),
      this._handler.createRole,
    )

    this._router.post(
      '/:roleId/user',
      paramParser(addUserParamSchema),
      bodyParser(addUserBodySchema),
      this._handler.addUser,
    )

    this._router.get(
      '/:roleId/users',
      paramParser(getUsersParamsSchema),
      queryParser(getUsersQuerySchema),
      this._handler.getUsers,
    )

    this._router.delete(
      '/:roleId/user',
      paramParser(removeUserParamSchema),
      bodyParser(removeUserBodySchema),
      this._handler.removeUser,
    )

    this._router.post(
      '/:roleId/permission',
      paramParser(addPermissionParamSchema),
      bodyParser(addPermissionBodySchema),
      this._handler.addPermission,
    )

    this._router.get(
      '/:roleId/permissions',
      paramParser(getPermissionsParamsSchema),
      queryParser(getPermissionsQuerySchema),
      this._handler.getPermissions,
    )

    this._router.delete(
      '/:roleId/permission',
      paramParser(removePermissionParamSchema),
      bodyParser(removePermissionBodySchema),
      this._handler.removePermission,
    )

    this._router.get(
      '/:roleId',
      paramParser(getRoleByIdParamsSchema),
      this._handler.getRoleById,
    )
  }

  public getRouter(): Router {
    return this._router
  }
}
