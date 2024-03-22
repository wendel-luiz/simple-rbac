import { type TenantRepository } from 'modules/tenant/commands/tenant.repository'
import { type ActionRepository } from './action.repository'
import { type CreateActionBody } from './dtos/create-action.dto'
import { ConflictException, NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'

export class ActionCommand {
  constructor(
    private readonly ActionRepo: ActionRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateActionBody): Promise<string> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.ActionRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A action called "${props.name}" already exists.`,
      )
    }

    const isActionUsed = await this.ActionRepo.isActionInUse(props.action)
    if (isActionUsed) {
      throw new ConflictException(
        `A action identifier called "${props.action}" already exists.`,
      )
    }

    const code = generate()
    await this.ActionRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return code
  }
}
