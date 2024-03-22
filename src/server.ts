import express, { type Application } from 'express'
import cors from 'cors'
import { env } from 'config/env.config'
import type http from 'http'
import { UserController } from 'modules/user/user.controller'
import { TenantController } from 'modules/tenant/tenant.controller'
import { errorHandler } from 'middleware/error-handler'
import { RoleController } from 'modules/role/role.controller'
import { ResourceController } from 'modules/resource/resource.controller'
import { ActionController } from 'modules/action/action.controller'

export class Server {
  private readonly _app: Application
  private readonly _server: http.Server

  private readonly _userController: UserController
  private readonly _tenantController: TenantController
  private readonly _roleController: RoleController
  private readonly _resourceController: ResourceController
  private readonly _actionController: ActionController

  constructor() {
    this._app = express()

    this._userController = new UserController()
    this._tenantController = new TenantController()
    this._roleController = new RoleController()
    this._resourceController = new ResourceController()
    this._actionController = new ActionController()

    this.configure()

    this._server = this.serve()
  }

  private configure(): void {
    this._app.use(cors())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))

    this._app.use('/user', this._userController.getRouter())
    this._app.use('/tenant', this._tenantController.getRouter())
    this._app.use('/role', this._roleController.getRouter())
    this._app.use('/resource', this._resourceController.getRouter())
    this._app.use('/action', this._actionController.getRouter())

    this._app.use(errorHandler)
  }

  private serve(): http.Server {
    return this._app.listen(env.SERVER_PORT, () => {
      console.info(`Server listening on port ${env.SERVER_PORT}`)
    })
  }

  public destroy(): void {
    this._server.close()
  }
}
