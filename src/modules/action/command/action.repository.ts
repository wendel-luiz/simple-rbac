import { type Database, type NewAction, type Action } from 'database/types'
import { type Kysely } from 'kysely'

export class ActionRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(Action: NewAction): Promise<void> {
    await this.db.insertInto('action').values(Action).executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<Action | undefined> {
    return await this.db
      .selectFrom('action')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }

  async isNameUsed(name: string): Promise<boolean> {
    const founded = await this.db
      .selectFrom('action')
      .select('id')
      .leftJoin('tenant', 'tenant.id', 'action.id')
      .where('name', '=', name)
      .executeTakeFirst()

    return founded != null
  }

  async isActionInUse(action: string): Promise<boolean> {
    const founded = await this.db
      .selectFrom('action')
      .select('id')
      .leftJoin('tenant', 'tenant.id', 'action.id')
      .where('action.action', '=', action)
      .executeTakeFirst()

    return founded != null
  }
}
