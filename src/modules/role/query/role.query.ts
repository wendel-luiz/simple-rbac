import { type Database } from 'database/types'
import { type Kysely } from 'kysely'
import { NotFoundException } from 'lib/exceptions'
import { type Query } from 'lib/response'
import { type GetRoleByIdResponse } from './dtos/get-by-id'

export class RoleQuery {
  constructor(private readonly db: Kysely<Database>) {}

  async getById(id: string): Query<GetRoleByIdResponse> {
    console.log('ASDasd', id)
    const role = await this.db
      .selectFrom('role')
      .select(['code', 'name', 'description'])
      .where('code', '=', id)
      .executeTakeFirst()

    if (role == null) {
      throw new NotFoundException('Role not found.')
    }

    return {
      id: role.code,
      name: role.name,
      description: role.description,
    }
  }
}
