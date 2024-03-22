import express, { type Router } from 'express'
import { TenantService } from './tenant.service'
import { TenantRepository } from './tenant.repository'
import { db } from 'database/connection'
import { createTenantSchema, type CreateTenant } from './tenant.types'
import { bodyParser } from 'middleware/body-parser'

export class TenantController {
  private readonly _tenantService: TenantService
  private readonly _router: Router

  constructor() {
    this._tenantService = new TenantService(new TenantRepository(db))
    this._router = express.Router()
    this.buildRoutes()
  }

  private buildRoutes(): void {
    this._router.post('/', bodyParser(createTenantSchema), (req, res, next) => {
      this._tenantService
        .create(req.body as CreateTenant)
        .then((response) => {
          res.status(201).send(response)
        })
        .catch((err) => {
          next(err)
        })
    })
  }

  public getRouter(): Router {
    return this._router
  }
}
