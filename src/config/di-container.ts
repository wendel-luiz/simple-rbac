import { dialect } from 'database/dialect'
import { type Database } from 'database/types'
import express from 'express'
import { Kysely } from 'kysely'
import { ActionController } from 'modules/action/action.controller'
import { ActionHandler } from 'modules/action/action.handler'
import { ActionRepository } from 'modules/action/action.repository'
import { ActionService } from 'modules/action/action.service'
import { ResourceController } from 'modules/resource/resource.controller'
import { ResourceHandler } from 'modules/resource/resource.handler'
import { ResourceRepository } from 'modules/resource/resource.repository'
import { ResourceService } from 'modules/resource/resource.service'
import { RoleController } from 'modules/role/role.controller'
import { RoleHandler } from 'modules/role/role.handler'
import { RoleRepository } from 'modules/role/role.repository'
import { RoleService } from 'modules/role/role.service'
import { TenantController } from 'modules/tenant/tenant.controller'
import { TenantHandler } from 'modules/tenant/tenant.handler'
import { TenantRepository } from 'modules/tenant/tenant.repository'
import { TenantService } from 'modules/tenant/tenant.service'
import { UserController } from 'modules/user/user.controller'
import { UserHandler } from 'modules/user/user.handler'
import { UserRepository } from 'modules/user/user.repository'
import { UserService } from 'modules/user/user.service'
import { Server } from 'server'

// Base
const router = express.Router()
const db = new Kysely<Database>({ dialect })

// Repositories
const actionRepository = new ActionRepository(db)
const resourceRepository = new ResourceRepository(db)
const roleRepository = new RoleRepository(db)
const tenantRepository = new TenantRepository(db)
const userRepository = new UserRepository(db)

// Services
const actionService = new ActionService(actionRepository, tenantRepository)
const resourceService = new ResourceService(
  resourceRepository,
  tenantRepository,
)
const roleService = new RoleService(
  roleRepository,
  tenantRepository,
  userRepository,
  resourceRepository,
  actionRepository,
)
const tenantService = new TenantService(tenantRepository)
const userService = new UserService(userRepository, tenantRepository)

// Handlers
const actionHandler = new ActionHandler(actionService)
const resourceHandler = new ResourceHandler(resourceService)
const roleHandler = new RoleHandler(roleService)
const tenantHandler = new TenantHandler(tenantService)
const userHandler = new UserHandler(userService)

// Controllers
const actionController = new ActionController(actionHandler, router)
const resourceController = new ResourceController(resourceHandler, router)
const roleController = new RoleController(roleHandler, router)
const tenantController = new TenantController(tenantHandler, router)
const userController = new UserController(userHandler, router)

// Server
export const server = new Server(
  userController,
  tenantController,
  roleController,
  resourceController,
  actionController,
)
