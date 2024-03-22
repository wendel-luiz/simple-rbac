import { type Database } from 'database/types'
import { type Kysely } from 'kysely'
import { type GetResourceByIdResponse } from './dtos/get-by-id.dto'
import { NotFoundException } from 'lib/exceptions'
import { type Query } from 'lib/response'

export class ResourceQuery {
  constructor(private readonly db: Kysely<Database>) {}

  async getById(id: string): Query<GetResourceByIdResponse> {
    const Resource = await this.db
      .selectFrom('resource')
      .select(['code', 'name', 'description'])
      .where('code', '=', id)
      .executeTakeFirst()

    if (Resource == null) {
      throw new NotFoundException('Resource not found.')
    }

    return {
      id: Resource.code,
      name: Resource.name,
      description: Resource.description,
    }
  }
}
