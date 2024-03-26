import { type Router } from 'express'
import { bodyParser } from 'middleware/body-parser'
import { type TenantHandler } from './tenant.handlers'
import { createTenantBodySchema } from './dtos/create-tenant.dto'
import { paramParser } from 'middleware/param-parser'
import { getTenantByIdParamsSchema } from './dtos/get-by-id.dto'

export class TenantController {
  constructor(
    private readonly _handler: TenantHandler,
    private readonly _router: Router,
  ) {
    this._router.post(
      '/',
      bodyParser(createTenantBodySchema),
      this._handler.createTenant,
    )

    this._router.get(
      '/:tenantId',
      paramParser(getTenantByIdParamsSchema),
      this._handler.getTenantById,
    )
  }

  public getRouter(): Router {
    return this._router
  }
}
