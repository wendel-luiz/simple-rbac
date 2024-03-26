import { type RoleCommand } from './command/role.command'
import { type RoleQuery } from './query/role.query'
import {
  type CreateRoleParams,
  type CreateRoleBody,
} from './command/dtos/create-role.dto'
import { type RequestHandler } from 'express'
import { type GetRoleByIdParams } from './query/dtos/get-by-id'
import {
  type AddUserBody,
  type AddUserParams,
} from './command/dtos/add-user.dto'
import {
  type AddPermissionBody,
  type AddPermissionParams,
} from './command/dtos/add-permission.dto'

export class RoleHandler {
  constructor(
    private readonly command: RoleCommand,
    private readonly query: RoleQuery,
  ) {}

  public createRole: RequestHandler<
    CreateRoleParams,
    unknown,
    CreateRoleBody,
    unknown
  > = (req, res, next) => {
    this.command
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/role/' + result)
          .send(),
      )
      .catch((err) => next(err))
  }

  public addUser: RequestHandler<AddUserParams, unknown, AddUserBody, unknown> =
    (req, res, next) => {
      this.command
        .addUser(req.params.roleId, req.body.userId)
        .then((result) =>
          res
            .status(201)
            .setHeader('Location', '/role/' + result)
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
    this.command
      .addPermission(req.params.roleId, req.body.resourceId, req.body.actionId)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/role/' + result)
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
    this.query
      .getById(req.params.roleId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
