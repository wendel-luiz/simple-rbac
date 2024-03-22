import express, { type Router } from 'express'
import { ResourceHandler } from './resource.handler'
import { createResourceBodySchema } from './command/dtos/create-resource.dto'
import { getResourceByIdParamsSchema } from './query/dtos/get-by-id.dto'
import { bodyParser } from 'middleware/body-parser'
import { paramParser } from 'middleware/param-parser'

export class ResourceController {
  private readonly _handler: ResourceHandler
  private readonly _router: Router

  constructor() {
    this._handler = new ResourceHandler()
    this._router = express.Router()
    this.buildRoutes()
  }

  public getRouter(): Router {
    return this._router
  }

  private buildRoutes(): void {
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
}
