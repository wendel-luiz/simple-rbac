import {
  type NewUserRole,
  type Database,
  type NewRoleTable,
  type Role,
  type NewPermission,
  type Permission,
} from 'database/types'
import { type Kysely } from 'kysely'

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
}
