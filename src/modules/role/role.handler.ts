import {
  type CreateRoleParams,
  type CreateRoleBody,
} from './dtos/create-role.dto'
import { type RequestHandler } from 'express'
import { type GetRoleByIdParams } from './dtos/get-by-id'
import { type AddUserBody, type AddUserParams } from './dtos/add-user.dto'
import {
  type AddPermissionBody,
  type AddPermissionParams,
} from './dtos/add-permission.dto'
import { type RoleService } from './role.service'

export class RoleHandler {
  constructor(private readonly service: RoleService) {}

  public createRole: RequestHandler<
    CreateRoleParams,
    unknown,
    CreateRoleBody,
    unknown
  > = (req, res, next) => {
    this.service
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/role/' + result.code)
          .send(),
      )
      .catch((err) => next(err))
  }

  public addUser: RequestHandler<AddUserParams, unknown, AddUserBody, unknown> =
    (req, res, next) => {
      this.service
        .addUser(req.params.roleId, req.body.userId)
        .then((result) =>
          res
            .status(201)
            .setHeader('Location', '/role/' + result.code)
            .send(),
        )
        .catch((err) => next(err))
    }

  public addPermission: RequestHandler<
    AddPermissionParams,
    unknown,
    AddPermissionBody,
    unknown
  > = (req, res, next) => {
    this.service
      .addPermission(req.params.roleId, req.body.resourceId, req.body.actionId)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/role/' + result.code)
          .send(),
      )
      .catch((err) => next(err))
  }

  public getRoleById: RequestHandler<
    GetRoleByIdParams,
    unknown,
    unknown,
    unknown
  > = (req, res, next) => {
    this.service
      .getById(req.params.roleId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
