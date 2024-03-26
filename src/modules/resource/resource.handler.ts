import { type RequestHandler } from 'express'
import {
  type CreateResourceBody,
  type CreateResourceParams,
} from './dtos/create-resource.dto'
import { type GetResourceByIdParams } from './dtos/get-by-id.dto'
import { type ResourceService } from './resource.service'

export class ResourceHandler {
  constructor(private readonly service: ResourceService) {}

  public createResource: RequestHandler<
    CreateResourceParams,
    unknown,
    CreateResourceBody,
    unknown
  > = (req, res, next) => {
    this.service
      .create(req.params.tenantId, req.body)
      .then((result) =>
        res
          .status(201)
          .setHeader('Location', '/resource/' + result.code)
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
    this.service
      .getById(req.params.resourceId)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err))
  }
}
