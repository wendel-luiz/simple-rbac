import { db } from 'database/connection'
import { RoleCommand } from './command/role.command'
import { RoleRepository } from './command/role.repository'
import { RoleQuery } from './query/role.query'
import {
  type CreateRoleParams,
  type CreateRoleBody,
} from './command/dtos/create-role.dto'
import { type RequestHandler } from 'express'
import { type GetRoleByIdParams } from './query/dtos/get-by-id'
import { TenantRepository } from 'modules/tenant/commands/tenant.repository'

export class RoleHandler {
  private readonly command: RoleCommand
  private readonly query: RoleQuery

  constructor() {
    this.command = new RoleCommand(
      new RoleRepository(db),
      new TenantRepository(db),
    )
    this.query = new RoleQuery(db)
  }

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
