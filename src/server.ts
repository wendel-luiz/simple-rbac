import express, { type Application } from 'express'
import cors from 'cors'
import { env } from 'config/env.config'
import type http from 'http'
import { UserController } from 'modules/user/user.controller'
import { TenantController } from 'modules/tenant/tenant.controller'
import { errorHandler } from 'middleware/error-handler'
import { responseHandler } from 'middleware/response-handler'

export class Server {
  private readonly _app: Application
  private readonly _server: http.Server

  private readonly _userController: UserController
  private readonly _tenantController: TenantController

  constructor() {
    this._app = express()

    this._userController = new UserController()
    this._tenantController = new TenantController()

    this.configure()
    this._server = this.serve()
  }

  private configure(): void {
    this._app.use(cors())
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: true }))

    this._app.use('/user', this._userController.getRouter())
    this._app.use('/tenant', this._tenantController.getRouter())

    this._app.use(errorHandler)
    this._app.use(responseHandler)
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
