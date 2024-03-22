import { type Database } from 'database/types'
import { type Kysely } from 'kysely'
import { NotFoundException } from 'lib/exceptions'
import { type Query } from 'lib/response'
import { type GetUserByIdResponse } from './dtos/get-by-id.dto'

export class UserQuery {
  constructor(private readonly db: Kysely<Database>) {}

  async getById(id: string): Query<GetUserByIdResponse> {
    const user = await this.db
      .selectFrom('user')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()

    if (user == null) {
      throw new NotFoundException('User not found.')
    }

    return {
      id: user.code,
      email: user.email,
    }
  }
}
