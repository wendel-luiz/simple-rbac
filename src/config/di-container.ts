import express from 'express'
import { dialect } from 'database/dialect'
import { type Database } from 'database/types'
import { Kysely } from 'kysely'
import { ActionController } from 'modules/action/action.controller'
import { ActionHandler } from 'modules/action/action.handler'
import { ActionCommand } from 'modules/action/command/action.command'
import { ActionRepository } from 'modules/action/command/action.repository'
import { ActionQuery } from 'modules/action/query/action.query'
import { ResourceCommand } from 'modules/resource/command/resource.command'
import { ResourceRepository } from 'modules/resource/command/resource.repository'
import { ResourceQuery } from 'modules/resource/query/resource.query'
import { ResourceHandler } from 'modules/resource/resource.handler'
import { RoleCommand } from 'modules/role/command/role.command'
import { RoleRepository } from 'modules/role/command/role.repository'
import { RoleQuery } from 'modules/role/query/role.query'
import { RoleHandler } from 'modules/role/role.handler'
import { TenantCommand } from 'modules/tenant/commands/tenant.commands'
import { TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { TenantQuery } from 'modules/tenant/queries/tenant.queries'
import { TenantHandler } from 'modules/tenant/tenant.handlers'
import { UserCommand } from 'modules/user/commands/user.commands'
import { UserRepository } from 'modules/user/commands/user.repository'
import { UserQuery } from 'modules/user/queries/user.queries'
import { UserHandler } from 'modules/user/user.handlers'
import { ResourceController } from 'modules/resource/resource.controller'
import { RoleController } from 'modules/role/role.controller'
import { TenantController } from 'modules/tenant/tenant.controller'
import { UserController } from 'modules/user/user.controller'
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

// Commands
const actionCommand = new ActionCommand(actionRepository, tenantRepository)
const resourceCommand = new ResourceCommand(
  resourceRepository,
  tenantRepository,
)
const roleCommand = new RoleCommand(
  roleRepository,
  tenantRepository,
  userRepository,
  resourceRepository,
  actionRepository,
)
const tenantCommand = new TenantCommand(tenantRepository)
const userCommand = new UserCommand(userRepository, tenantRepository)

// Queries
const actionQuery = new ActionQuery(db)
const resourceQuery = new ResourceQuery(db)
const roleQuery = new RoleQuery(db)
const tenantQuery = new TenantQuery(db)
const userQuery = new UserQuery(db)

// Handlers
const actionHandler = new ActionHandler(actionCommand, actionQuery)
const resourceHandler = new ResourceHandler(resourceCommand, resourceQuery)
const roleHandler = new RoleHandler(roleCommand, roleQuery)
const tenantHandler = new TenantHandler(tenantCommand, tenantQuery)
const userHandler = new UserHandler(userCommand, userQuery)

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
