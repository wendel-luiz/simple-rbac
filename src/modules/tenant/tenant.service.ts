import { type TenantRepository } from './tenant.repository'
import { type CreateTenant } from './tenant.types'
import { InternalServerError } from 'lib/exceptions'
import { type Tenant } from 'database/types'

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenant): Promise<Tenant> {
    const tenant = await this.tenantRepo.insert({
      ...props,
    })

    if (tenant == null) {
      throw new InternalServerError('Error while inserting a new tenant.')
    }

    return tenant
  }
}
