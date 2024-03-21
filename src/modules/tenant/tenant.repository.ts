import { type Tenant, type Database } from 'database/types'
import { type Kysely } from 'kysely'

export class TenantRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string): Promise<Tenant | undefined> {
    return await this.db
      .selectFrom('tenant')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }
}
