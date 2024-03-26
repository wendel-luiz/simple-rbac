import { type RequestHandler } from 'express'
import {
  type CreateUserBody,
  type CreateUserParams,
} from './dtos/create-user.dto'
import { type GetUserByIdParams } from './dtos/get-by-id.dto'
import { type LoginBody } from './dtos/login.dto'
import { type ValidateTokenBody } from './dtos/validate-token.dto'
import { type UserService } from './user.service'

export class UserHandler {
  constructor(private readonly service: UserService) {}

  public createUser: RequestHandler<
    CreateUserParams,
    unknown,
    CreateUserBody,
    unknown
  > = (req, res, next) => {
    this.service
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/user/' + result.code)
          .send(),
      )
      .catch((err) => next(err))
  }

  public loginUser: RequestHandler<unknown, unknown, LoginBody, unknown> = (
    req,
    res,
    next,
  ) => {
    this.service
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
    this.service
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
    this.service
      .getById(req.params.userId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
