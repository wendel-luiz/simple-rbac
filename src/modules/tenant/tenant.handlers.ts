import { type TenantCommand } from './commands/tenant.commands'
import { type CreateTenantBody } from './commands/dtos/create-tenant.dto'
import { type RequestHandler } from 'express'
import { type GetTenantByIdParams } from './queries/dtos/get-by-id.dto'
import { type TenantQuery } from './queries/tenant.queries'

export class TenantHandler {
  constructor(
    private readonly command: TenantCommand,
    private readonly query: TenantQuery,
  ) {}

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
