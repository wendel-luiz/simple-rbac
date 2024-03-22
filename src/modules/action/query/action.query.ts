import { type Database } from 'database/types'
import { type Kysely } from 'kysely'
import { type Query } from 'lib/response'
import { type GetActionByIdResponse } from './dtos/get-by-id.dto'
import { NotFoundException } from 'lib/exceptions'

export class ActionQuery {
  constructor(private readonly db: Kysely<Database>) {}

  async getById(id: string): Query<GetActionByIdResponse> {
    const Action = await this.db
      .selectFrom('action')
      .selectAll()
      .where('code', '=', id)
      .executeTakeFirst()

    if (Action == null) {
      throw new NotFoundException('Action not found.')
    }

    return {
      id: Action.code,
      name: Action.name,
      description: Action.description,
    }
  }
}
