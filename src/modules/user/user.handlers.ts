import { type RequestHandler } from 'express'
import { type CreateUserBody, type CreateUserParams } from './user.types'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'
import { TenantRepository } from 'modules/tenant/tenant.repository'
import { db } from 'database/connection'

export class UserHandler {
  private readonly _userService: UserService

  constructor() {
    this._userService = new UserService(
      new UserRepository(db),
      new TenantRepository(db),
    )
  }

  public createUser: RequestHandler<
    CreateUserParams,
    unknown,
    CreateUserBody,
    unknown
  > = (req, res, next) => {
    this._userService
      .create(req.params.tenantId, req.body)
      .then((response) => {
        res.locals = response
        res.status(201)
        next()
      })
      .catch((err) => {
        next(err)
      })
  }
}
