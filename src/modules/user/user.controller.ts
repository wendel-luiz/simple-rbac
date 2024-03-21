import { db } from 'database/connection'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import { TenantRepository } from 'modules/tenant/tenant.repository'
import express, { type Router } from 'express'
import { type CreateUser } from './user.types'

export class UserController {
  private readonly _userService: UserService
  private readonly _router: Router

  constructor() {
    this._userService = new UserService(
      new UserRepository(db),
      new TenantRepository(db),
    )

    this._router = express.Router()

    this.buildRoutes()
  }

  private buildRoutes(): void {
    this._router.post('/:tenantId', (req, res) => {
      this._userService
        .create(req.params.tenantId, req.body as CreateUser)
        .then(() => {
          res.status(201)
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
