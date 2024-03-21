import { type Database, type NewUser, type User } from 'database/types'
import { type Kysely } from 'kysely'

export class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(user: NewUser): Promise<User | undefined> {
    return await this.db
      .insertInto('user')
      .values(user)
      .returningAll()
      .executeTakeFirst()
  }
}
