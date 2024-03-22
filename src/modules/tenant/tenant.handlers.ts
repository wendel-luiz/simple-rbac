import { db } from 'database/connection'
import { TenantCommand } from './commands/tenant.commands'
import { TenantRepository } from './commands/tenant.repository'
import { type CreateTenantBody } from './commands/dtos/create-tenant.dto'
import { type RequestHandler } from 'express'
import { type GetTenantByIdParams } from './queries/dtos/get-by-id.dto'
import { TenantQuery } from './queries/tenant.queries'

export class TenantHandler {
  private readonly command: TenantCommand
  private readonly query: TenantQuery

  constructor() {
    this.command = new TenantCommand(new TenantRepository(db))
    this.query = new TenantQuery(db)
  }

  public createTenant: RequestHandler<
    unknown,
    unknown,
    CreateTenantBody,
    unknown
  > = (req, res, next) => {
    this.command
      .create(req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/tenant/' + result)
          .send(),
      )
      .catch((err) => next(err))
  }

  public getTenantById: RequestHandler<
    GetTenantByIdParams,
    unknown,
    unknown,
    unknown
  > = (req, res, next) => {
    this.query
      .getById(req.params.tenantId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
