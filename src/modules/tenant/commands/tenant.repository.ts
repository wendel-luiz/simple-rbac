import { type Tenant, type Database, type NewTenant } from 'database/types'
import { type Kysely } from 'kysely'

export class TenantRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(tenant: NewTenant): Promise<void> {
    await this.db.insertInto('tenant').values(tenant).executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<Tenant | undefined> {
    return await this.db
      .selectFrom('tenant')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }

  async isNameUsed(name: string): Promise<boolean> {
    const founded = await this.db
      .selectFrom('tenant')
      .select('id')
      .where('name', '=', name)
      .executeTakeFirst()

    return founded != null
  }
}
