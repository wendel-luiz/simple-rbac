import { type CreateTenantBody } from './dtos/create-tenant.dto'
import { type RequestHandler } from 'express'
import { type GetTenantByIdParams } from './dtos/get-by-id.dto'
import { type TenantService } from './tenant.service'

export class TenantHandler {
  constructor(private readonly service: TenantService) {}

  public createTenant: RequestHandler<
    unknown,
    unknown,
    CreateTenantBody,
    unknown
  > = (req, res, next) => {
    this.service
      .create(req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/tenant/' + result.code)
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
    this.service
      .getById(req.params.tenantId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
