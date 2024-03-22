import { type User, type Database, type NewUser } from 'database/types'
import { type Kysely } from 'kysely'

export class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(user: NewUser): Promise<void> {
    await this.db.insertInto('user').values(user).executeTakeFirstOrThrow()
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()
  }

  async isEmailInUse(email: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('user')
      .select((eb) => eb.fn.count<number>('user.id').as('count'))
      .leftJoin('tenant', 'tenant.id', 'user.tenantId')
      .where('user.email', '=', email)
      .executeTakeFirst()

    if (result == null || result.count <= 0) return false

    return true
  }
}
