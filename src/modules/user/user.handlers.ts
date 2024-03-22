import { type RequestHandler } from 'express'
import { UserRepository } from './commands/user.repository'
import { TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { db } from 'database/connection'
import {
  type CreateUserBody,
  type CreateUserParams,
} from './commands/dtos/create-user.dto'
import { UserCommand } from './commands/user.commands'
import { type GetUserByIdParams } from './queries/dtos/get-by-id.dto'
import { UserQuery } from './queries/user.queries'

export class UserHandler {
  private readonly command: UserCommand
  private readonly query: UserQuery

  constructor() {
    this.command = new UserCommand(
      new UserRepository(db),
      new TenantRepository(db),
    )

    this.query = new UserQuery(db)
  }

  public createUser: RequestHandler<
    CreateUserParams,
    unknown,
    CreateUserBody,
    unknown
  > = (req, res, next) => {
    this.command
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/user/' + result)
          .send(),
      )
      .catch((err) => next(err))
  }

  public getUserById: RequestHandler<
    GetUserByIdParams,
    unknown,
    unknown,
    unknown
  > = (req, res, next) => {
    this.query
      .getById(req.params.userId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
