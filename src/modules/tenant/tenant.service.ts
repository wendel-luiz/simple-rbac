import { generate } from 'short-uuid'
import { type TenantRepository } from './tenant.repository'
import { ConflictException, NotFoundException } from 'lib/exceptions'
import { type Tenant } from 'database/types'
import { type GetTenantByIdResponse } from './dtos/get-by-id.dto'
import { type CreateTenantBody } from './dtos/create-tenant.dto'

export class TenantService {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenantBody): Promise<Tenant> {
    const isNameUsed = await this.tenantRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A tenant called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    const newTenant = await this.tenantRepo.insert({
      ...props,
      code,
    })

    return newTenant
  }

  async getById(id: string): Promise<GetTenantByIdResponse> {
    const tenant = await this.tenantRepo.findById(id)

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
