import express, { type Router } from 'express'
import { TenantService } from './tenant.service'
import { TenantRepository } from './tenant.repository'
import { db } from 'database/connection'
import { type CreateTenant } from './tenant.types'

export class TenantController {
  private readonly _tenantService: TenantService
  private readonly _router: Router

  constructor() {
    this._tenantService = new TenantService(new TenantRepository(db))
    this._router = express.Router()
    this.buildRoutes()
  }

  private buildRoutes(): void {
    this._router.post('/', (req, res) => {
      this._tenantService
        .create(req.body as CreateTenant)
        .then(() => {
          res.status(201).send()
        })
        .catch((err) => {
          throw err
        })
    })
  }

  public getRouter(): Router {
    return this._router
  }
}
