import { TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { ActionCommand } from './command/action.command'
import { ActionRepository } from './command/action.repository'
import { ActionQuery } from './query/action.query'
import { db } from 'database/connection'
import { type RequestHandler } from 'express'
import {
  type CreateActionBody,
  type CreateActionParams,
} from './command/dtos/create-action.dto'
import { type GetActionByIdParams } from './query/dtos/get-by-id.dto'

export class ActionHandler {
  private readonly command: ActionCommand
  private readonly query: ActionQuery

  constructor() {
    this.command = new ActionCommand(
      new ActionRepository(db),
      new TenantRepository(db),
    )
    this.query = new ActionQuery(db)
  }

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
