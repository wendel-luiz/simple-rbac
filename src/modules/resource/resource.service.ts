import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type ResourceRepository } from './resource.repository'
import { type CreateResourceBody } from './dtos/create-resource.dto'
import { ConflictException, NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'
import { type Resource } from 'database/types'
import { type GetResourceByIdResponse } from './dtos/get-by-id.dto'

export class ResourceService {
  constructor(
    private readonly resourceRepo: ResourceRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateResourceBody): Promise<Resource> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.resourceRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A resource called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    const newCommand = await this.resourceRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return newCommand
  }

  async getById(id: string): Promise<GetResourceByIdResponse> {
    const resource = await this.resourceRepo.findById(id)
    if (resource == null) {
      throw new NotFoundException('Resource not found.')
    }

    return {
      id: resource.code,
      name: resource.name,
      description: resource.description,
    }
  }
}
