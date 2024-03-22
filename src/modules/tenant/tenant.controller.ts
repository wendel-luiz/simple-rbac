import express, { type Router } from 'express'
import { bodyParser } from 'middleware/body-parser'
import { TenantHandler } from './tenant.handlers'
import { createTenantBodySchema } from './commands/dtos/create-tenant.dto'
import { paramParser } from 'middleware/param-parser'
import { getTenantByIdParamsSchema } from './queries/dtos/get-by-id.dto'

export class TenantController {
  private readonly _handler: TenantHandler
  private readonly _router: Router

  constructor() {
    this._handler = new TenantHandler()
    this._router = express.Router()
    this.buildRoutes()
  }

  public getRouter(): Router {
    return this._router
  }

  private buildRoutes(): void {
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
}
