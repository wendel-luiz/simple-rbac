import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type UserRepository } from './user.repository'
import { type CreateUserBody } from './dtos/create-user.dto'
import { NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'
import { type Command } from 'lib/response'

export class UserCommand {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateUserBody): Command {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const code = generate()

    await this.userRepo.insert({
      ...props,
      tenantId: tenant.id,
      code,
    })

    return code
  }
}
