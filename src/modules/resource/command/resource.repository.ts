import { type Database, type NewResource, type Resource } from 'database/types'
import { type Kysely } from 'kysely'

export class ResourceRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(Resource: NewResource): Promise<void> {
    await this.db
      .insertInto('resource')
      .values(Resource)
      .executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<Resource | undefined> {
    return await this.db
      .selectFrom('resource')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }

  async isNameUsed(name: string): Promise<boolean> {
    const founded = await this.db
      .selectFrom('resource')
      .select('resource.id')
      .leftJoin('tenant', 'tenant.id', 'resource.id')
      .where('resource.name', '=', name)
      .executeTakeFirst()

    return founded != null
  }
}
