import { generate } from 'short-uuid'
import { type TenantRepository } from './tenant.repository'
import { type CreateTenantBody } from './dtos/create-tenant.dto'
import { ConflictException } from 'lib/exceptions'

export class TenantCommand {
  constructor(private readonly tenantRepo: TenantRepository) {}

  async create(props: CreateTenantBody): Promise<string> {
    const isNameUsed = await this.tenantRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A tenant called "${props.name}" already exists.`,
      )
    }

    const code = generate()
    await this.tenantRepo.insert({
      ...props,
      code,
    })

    return code
  }
}
