import { type TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { type ResourceRepository } from './resource.repository'
import { type CreateResourceBody } from './dtos/create-resource.dto'
import { ConflictException, NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'

export class ResourceCommand {
  constructor(
    private readonly ResourceRepo: ResourceRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateResourceBody): Promise<string> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.ResourceRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A resource called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    await this.ResourceRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return code
  }
}
