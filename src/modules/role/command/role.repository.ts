import {
  type NewUserRole,
  type Database,
  type NewRoleTable,
  type Role,
} from 'database/types'
import { type Kysely } from 'kysely'

export class RoleRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(role: NewRoleTable): Promise<void> {
    await this.db.insertInto('role').values(role).executeTakeFirstOrThrow()
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
}
