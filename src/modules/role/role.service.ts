import { generate } from 'short-uuid'
import { type RoleRepository } from './role.repository'
import { type TenantRepository } from 'modules/tenant/tenant.repository'
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from 'lib/exceptions'
import { type UserRepository } from 'modules/user/user.repository'
import { type ResourceRepository } from 'modules/resource/resource.repository'
import { type ActionRepository } from 'modules/action/action.repository'
import { type Role } from 'database/types'
import { type GetRoleByIdResponse } from './dtos/get-by-id'
import { type CreateRoleBody } from './dtos/create-role.dto'

export class RoleService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly tenantRepo: TenantRepository,
    private readonly userRepo: UserRepository,
    private readonly resourceRepo: ResourceRepository,
    private readonly actionRepo: ActionRepository,
  ) {}

  async create(tenantId: string, props: CreateRoleBody): Promise<Role> {
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
    const newRole = await this.roleRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return newRole
  }

  async addUser(roleId: string, userId: string): Promise<Role> {
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

    return role
  }

  async getUsers(
    roleId: string,
    page?: number,
    take?: number,
  ): Promise<unknown> {
    const role = await this.roleRepo.findById(roleId)
    if (role == null) {
      throw new NotFoundException('Role not found.')
    }

    const result = await this.roleRepo.getUsers({
      params: {
        roleId: role.id,
      },
      page,
      take,
    })

    return result
  }

  async removeUser(roleId: string, userId: string): Promise<Role> {
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

    const userRole = await this.roleRepo.findUserRole(user.id, role.id)
    if (userRole == null) {
      return role
    }

    await this.roleRepo.deleteUserRole(userRole)
    return role
  }

  async addPermission(
    roleId: string,
    resourceId: string,
    actionId: string,
  ): Promise<Role> {
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

    return role
  }

  async removePermission(
    roleId: string,
    resourceId: string,
    actionId: string,
  ): Promise<Role> {
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

    const permission = await this.roleRepo.findPermission(
      role.id,
      resource.id,
      action.id,
    )
    if (permission == null) {
      return role
    }

    await this.roleRepo.deletePermission(permission)
    return role
  }

  async getById(id: string): Promise<GetRoleByIdResponse> {
    const role = await this.roleRepo.findById(id)

    if (role == null) {
      throw new NotFoundException('Role not found.')
    }

    return {
      id: role.code,
      name: role.name,
      description: role.description,
    }
  }
}
