import express, { type Router } from 'express'
import { type ResourceHandler } from './resource.handler'
import { createResourceBodySchema } from './dtos/create-resource.dto'
import { getResourceByIdParamsSchema } from './dtos/get-by-id.dto'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'

export class ResourceController {
  private readonly _router: Router
  constructor(private readonly _handler: ResourceHandler) {
    this._router = express.Router()

    this._router.post(
      '/tenant/:tenantId',
      bodyParser(createResourceBodySchema),
      this._handler.createResource,
    )

    this._router.get(
      '/:resourceId',
      paramParser(getResourceByIdParamsSchema),
      this._handler.getResourceById,
    )
  }

  public getRouter(): Router {
    return this._router
  }
}
