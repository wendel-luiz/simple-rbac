import { generate } from 'short-uuid'
import { type RoleRepository } from './role.repository'
import { type CreateRoleBody } from './dtos/create-role.dto'
import { type TenantRepository } from 'modules/tenant/commands/tenant.repository'
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from 'lib/exceptions'
import { type UserRepository } from 'modules/user/commands/user.repository'
import { type Command } from 'lib/response'
import { type ResourceRepository } from 'modules/resource/command/resource.repository'
import { type ActionRepository } from 'modules/action/command/action.repository'

export class RoleCommand {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly userRepo: UserRepository,
    private readonly resourceRepo: ResourceRepository,
    private readonly actionRepo: ActionRepository,
  ) {}

  async create(tenantId: string, props: CreateRoleBody): Promise<string> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.roleRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A role called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    await this.roleRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return code
  }

  async addUser(roleId: string, userId: string): Command {
    const role = await this.roleRepo.findById(roleId)
    if (role == null) {
      throw new NotFoundException('Role not found.')
    }

    const user = await this.userRepo.findById(userId)
    if (user == null) {
      throw new NotFoundException('User not found.')
    }

    if (role.tenantId !== user.tenantId) {
      throw new ForbiddenException('Cannot add a user from different tenant.')
    }

    const isIncluded = await this.roleRepo.isAlreadyIncluded(user.id, role.id)
    if (isIncluded) {
      throw new ConflictException('User already included.')
    }

    await this.roleRepo.addToRole({
      roleId: role.id,
      userId: user.id,
    })

    return role.code
  }

  async addPermission(
    roleId: string,
    resourceId: string,
    actionId: string,
  ): Command {
    const role = await this.roleRepo.findById(roleId)
    if (role == null) {
      throw new NotFoundException('Role not found.')
    }

    const resource = await this.resourceRepo.findById(resourceId)
    if (resource == null) {
      throw new NotFoundException('Resource not found.')
    }

    const action = await this.actionRepo.findById(actionId)
    if (action == null) {
      throw new NotFoundException('Action not found.')
    }

    const isIncluded = await this.roleRepo.isPermissionAlreadyIncluded(
      role.id,
      resource.id,
      action.id,
    )
    if (isIncluded) {
      throw new ConflictException('Permission already included.')
    }

    await this.roleRepo.addPermission({
      actionId: action.id,
      resourceId: resource.id,
      roleId: role.id,
    })

    return role.code
  }
}
