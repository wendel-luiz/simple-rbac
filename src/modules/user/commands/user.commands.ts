import { type TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { type UserRepository } from './user.repository'
import { type CreateUserBody } from './dtos/create-user.dto'
import { ConflictException, NotFoundException } from 'lib/exceptions'
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

    const isInUse = await this.userRepo.isEmailInUse(props.email)
    if (isInUse) {
      throw new ConflictException('E-mail already in use for this tenant.')
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
