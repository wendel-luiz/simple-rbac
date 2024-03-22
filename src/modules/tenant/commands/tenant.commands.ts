import { generate } from 'short-uuid'
import { type TenantRepository } from './tenant.repository'
import { type CreateTenantBody } from './dtos/create-tenant.dto'

export class TenantCommand {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenantBody): Promise<string> {
    const code = generate()
    await this.tenantRepo.insert({
      ...props,
      code,
    })

    return code
  }
}
