import { generate } from 'short-uuid'
import { type RoleRepository } from './role.repository'
import { type CreateRoleBody } from './dtos/create-role.dto'
import { type TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { ConflictException, NotFoundException } from 'lib/exceptions'

export class RoleCommand {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateRoleBody): Promise<string> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.roleRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A role called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    await this.roleRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return code
  }
}
