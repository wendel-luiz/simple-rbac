import { type Database } from 'database/types'
import { type Kysely } from 'kysely'
import { NotFoundException } from 'lib/exceptions'
import { type Query } from 'lib/response'
import { type GetTenantByIdResponse } from './dtos/get-by-id.dto'

export class TenantQuery {
  constructor(private readonly db: Kysely<Database>) {}

  async getById(id: string): Query<GetTenantByIdResponse> {
    const tenant = await this.db
      .selectFrom('tenant')
      .select(['code', 'name', 'description'])
      .where('code', '=', id)
      .executeTakeFirst()

    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    return {
      id: tenant.code,
      name: tenant.name,
      description: tenant.description,
    }
  }
}
