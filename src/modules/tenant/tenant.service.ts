import { type TenantRepository } from './tenant.repository'
import { type CreateTenant } from './tenant.types'
import { generate } from 'short-uuid'

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenant): Promise<string> {
    const code = generate()
    await this.tenantRepo.insert({
      ...props,
      code,
    })

    return code
  }
}
