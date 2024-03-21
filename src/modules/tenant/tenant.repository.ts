import { type Tenant, type Database, type NewTenant } from 'database/types'
import { type Kysely } from 'kysely'

export class TenantRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(tenant: NewTenant): Promise<Tenant | undefined> {
    return await this.db
      .insertInto('tenant')
      .values(tenant)
      .returningAll()
      .executeTakeFirst()
  }

  async findById(id: string): Promise<Tenant | undefined> {
    return await this.db
      .selectFrom('tenant')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }
}
