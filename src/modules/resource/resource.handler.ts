import { type ResourceCommand } from './command/resource.command'
import { type ResourceQuery } from './query/resource.query'
import { type RequestHandler } from 'express'
import {
  type CreateResourceBody,
  type CreateResourceParams,
} from './command/dtos/create-resource.dto'
import { type GetResourceByIdParams } from './query/dtos/get-by-id.dto'

export class ResourceHandler {
  constructor(
    private readonly command: ResourceCommand,
    private readonly query: ResourceQuery,
  ) {}

  public createResource: RequestHandler<
    CreateResourceParams,
    unknown,
    CreateResourceBody,
    unknown
  > = (req, res, next) => {
    this.command
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/resource/' + result)
          .send(),
      )
      .catch((err) => next(err))
  }

  public getResourceById: RequestHandler<
    GetResourceByIdParams,
    unknown,
    unknown,
    unknown
  > = (req, res, next) => {
    this.query
      .getById(req.params.resourceId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
