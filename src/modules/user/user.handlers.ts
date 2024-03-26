import { type RequestHandler } from 'express'
import {
  type CreateUserBody,
  type CreateUserParams,
} from './commands/dtos/create-user.dto'
import { type UserCommand } from './commands/user.commands'
import { type GetUserByIdParams } from './queries/dtos/get-by-id.dto'
import { type UserQuery } from './queries/user.queries'
import { type LoginBody } from './commands/dtos/login.dto'
import { type ValidateTokenBody } from './commands/dtos/validate-token.dto'

export class UserHandler {
  constructor(
    private readonly command: UserCommand,
    private readonly query: UserQuery,
  ) {}

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

  public loginUser: RequestHandler<unknown, unknown, LoginBody, unknown> = (
    req,
    res,
    next,
  ) => {
    this.command
      .login(req.body.email, req.body.password, req.body.tenantId)
      .then((result) =>
        res.status(201).json({
          token: result,
        }),
      )
      .catch((err) => next(err))
  }

  public validateTokenUser: RequestHandler<
    unknown,
    unknown,
    ValidateTokenBody,
    unknown
  > = (req, res, next) => {
    this.command
      .isTokenValid(req.body.token)
      .then((result) =>
        res.status(201).json({
          isValid: result,
        }),
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
