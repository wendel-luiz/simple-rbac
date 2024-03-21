import { type TenantRepository } from './tenant.repository'
import { type CreateTenant } from './tenant.types'
import { InternalServerError } from 'lib/exceptions'

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenant): Promise<void> {
    const tenant = await this.tenantRepo.insert({
      ...props,
    })
    if (tenant == null) {
      throw new InternalServerError('Error while inserting a new tenant.')
    }
  }
}
