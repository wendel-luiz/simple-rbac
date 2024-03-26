import { type ActionCommand } from './command/action.command'
import { type ActionQuery } from './query/action.query'
import { type RequestHandler } from 'express'
import {
  type CreateActionBody,
  type CreateActionParams,
} from './command/dtos/create-action.dto'
import { type GetActionByIdParams } from './query/dtos/get-by-id.dto'

export class ActionHandler {
  constructor(
    private readonly command: ActionCommand,
    private readonly query: ActionQuery,
  ) {}

  public createAction: RequestHandler<
    CreateActionParams,
    unknown,
    CreateActionBody,
    unknown
  > = (req, res, next) => {
    this.command
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/action/' + result)
          .send(),
      )
      .catch((err) => next(err))
  }

  public getActionById: RequestHandler<
    GetActionByIdParams,
    unknown,
    unknown,
    unknown
  > = (req, res, next) => {
    this.query
      .getById(req.params.actionId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
