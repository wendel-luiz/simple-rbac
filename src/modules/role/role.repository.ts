import {
  type NewUserRole,
  type Database,
  type NewRoleTable,
  type Role,
  type NewPermission,
  type Permission,
  type UserRole,
} from 'database/types'
import { type Kysely } from 'kysely'
import { type Paginated } from 'lib/paginated'
import { type GetUsersResponse } from './dtos/get-users.dto'
import { type GetResourcesResponse } from './dtos/get-resources.dto'
import { type GetActionsByResourceResponse } from './dtos/get-actions.dto'

export class RoleRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(role: NewRoleTable): Promise<Role> {
    return await this.db
      .insertInto('role')
      .values(role)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<Role | undefined> {
    return await this.db
      .selectFrom('role')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }

  async isNameUsed(name: string): Promise<boolean> {
    const founded = await this.db
      .selectFrom('role')
      .select('role.id')
      .leftJoin('tenant', 'tenant.id', 'role.id')
      .where('role.name', '=', name)
      .executeTakeFirst()

    return founded != null
  }

  async isAlreadyIncluded(userId: number, roleId: number): Promise<boolean> {
    const result = await this.db
      .selectFrom('userRole')
      .select('userRole.id')
      .where('userRole.roleId', '=', roleId)
      .where('userRole.userId', '=', userId)
      .executeTakeFirst()

    return result != null
  }

  async addToRole(userRole: NewUserRole): Promise<void> {
    await this.db.insertInto('userRole').values(userRole).executeTakeFirst()
  }

  async isPermissionAlreadyIncluded(
    roleId: number,
    resourceId: number,
    actionId: number,
  ): Promise<boolean> {
    const result = await this.db
      .selectFrom('permission')
      .select('permission.id')
      .where('actionId', '=', actionId)
      .where('resourceId', '=', resourceId)
      .where('roleId', '=', roleId)
      .executeTakeFirst()

    return result != null
  }

  async addPermission(permission: NewPermission): Promise<Permission> {
    return await this.db
      .insertInto('permission')
      .values(permission)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  async findUserRole(
    userId: number,
    roleId: number,
  ): Promise<UserRole | undefined> {
    return await this.db
      .selectFrom('userRole')
      .selectAll()
      .where('userRole.roleId', '=', roleId)
      .where('userRole.userId', '=', userId)
      .executeTakeFirst()
  }

  async deleteUserRole(userRole: UserRole): Promise<void> {
    await this.db
      .deleteFrom('userRole')
      .where('userRole.id', '=', userRole.id)
      .executeTakeFirstOrThrow()
  }

  async findPermission(
    roleId: number,
    resourceId: number,
    actionId: number,
  ): Promise<Permission | undefined> {
    return await this.db
      .selectFrom('permission')
      .selectAll()
      .where('permission.roleId', '=', roleId)
      .where('permission.resourceId', '=', resourceId)
      .where('permission.actionId', '=', actionId)
      .executeTakeFirst()
  }

  async deletePermission(permission: Permission): Promise<void> {
    await this.db
      .deleteFrom('permission')
      .where('permission.id', '=', permission.id)
      .executeTakeFirstOrThrow()
  }

  async getUsers(
    params: Paginated<{ roleId: number }>,
  ): Promise<GetUsersResponse> {
    const take = params.take ?? 10
    const page = params.page ?? 1

    const skip = take * (page - 1)

    const query = this.db
      .selectFrom('userRole')
      .leftJoin('user', 'user.id', 'userRole.userId')
      .select([
        'userRole.id',
        'userRole.roleId',
        'user.email',
        'user.code',
        'userRole.createdAt',
      ])
      .offset(skip)
      .limit(take)
      .where('userRole.roleId', '=', params.params.roleId)

    const [data, count] = await Promise.all([
      query.execute(),
      query
        .clearSelect()
        .select((eb) => eb.fn.count<number>('userRole.id').as('total'))
        .executeTakeFirst(),
    ])

    const total = count?.total ?? 0

    return {
      page,
      pages: Math.ceil(total / skip),
      length: data.length,
      items: data.map((user) => ({
        id: user.code ?? '',
        email: user.email ?? '',
        createdAt: user.createdAt,
      })),
    }
  }

  async findResources(
    params: Paginated<{ roleId: number }>,
  ): Promise<GetResourcesResponse> {
    const take = params.take ?? 10
    const page = params.page ?? 1

    const skip = take * (page - 1)

    const query = this.db
      .selectFrom('resource')
      .selectAll()
      .leftJoin('permission', 'permission.resourceId', 'resource.id')
      .where('permission.roleId', '=', params.params.roleId)
      .offset(skip)
      .limit(take)

    const [data, count] = await Promise.all([
      query.distinctOn(['resource.id']).execute(),
      query
        .clearSelect()
        .select((eb) => eb.fn.count<number>('resource.id').as('total'))
        .groupBy('resource.id')
        .executeTakeFirst(),
    ])

    const total = count?.total ?? 0

    return {
      page,
      pages: Math.ceil(total / take),
      length: data.length,
      items: data.map((resource) => ({
        id: resource.code,
        name: resource.name,
        description: resource.description,
      })),
    }
  }

  async findActionsByResource(
    params: Paginated<{ resourceId: number }>,
  ): Promise<GetActionsByResourceResponse> {
    const take = params.take ?? 10
    const page = params.page ?? 1

    const skip = take * (page - 1)

    const query = this.db
      .selectFrom('action')
      .selectAll()
      .leftJoin('permission', 'permission.actionId', 'action.id')
      .where('permission.resourceId', '=', params.params.resourceId)
      .offset(skip)
      .limit(take)

    const [data, count] = await Promise.all([
      query.distinctOn(['action.id']).execute(),
      query
        .clearSelect()
        .select((eb) => eb.fn.count<number>('action.id').as('total'))
        .groupBy('action.id')
        .executeTakeFirst(),
    ])

    const total = count?.total ?? 0

    return {
      page,
      pages: Math.ceil(total / take),
      length: data.length,
      items: data.map((action) => ({
        id: action.code,
        name: action.name,
        action: action.action,
        description: action.description,
      })),
    }
  }
}
