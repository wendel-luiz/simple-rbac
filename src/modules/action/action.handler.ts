import { type RequestHandler } from 'express'
import {
  type CreateActionBody,
  type CreateActionParams,
} from './dtos/create-action.dto'
import { type GetActionByIdParams } from './dtos/get-by-id.dto'
import { type ActionService } from './action.service'

export class ActionHandler {
  constructor(private readonly service: ActionService) {}

  public createAction: RequestHandler<
    CreateActionParams,
    unknown,
    CreateActionBody,
    unknown
  > = (req, res, next) => {
    this.service
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/action/' + result.code)
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
    this.service
      .getById(req.params.actionId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
