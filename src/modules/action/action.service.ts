import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type ActionRepository } from './action.repository'
import { type CreateActionBody } from './dtos/create-action.dto'
import { ConflictException, NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'
import { type Action } from 'database/types'
import { type GetActionByIdResponse } from './dtos/get-by-id.dto'

export class ActionService {
  constructor(
    private readonly actionRepo: ActionRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateActionBody): Promise<Action> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isNameUsed = await this.actionRepo.isNameUsed(props.name)
    if (isNameUsed) {
      throw new ConflictException(
        `A action called "${props.name}" already exists.`,
      )
    }

    const isActionUsed = await this.actionRepo.isActionInUse(props.action)
    if (isActionUsed) {
      throw new ConflictException(
        `A action identifier called "${props.action}" already exists.`,
      )
    }

    const code = generate()
    const newAction = await this.actionRepo.insert({
      ...props,
      code,
      tenantId: tenant.id,
    })

    return newAction
  }

  async getById(id: string): Promise<GetActionByIdResponse> {
    const Action = await this.actionRepo.findById(id)
    if (Action == null) {
      throw new NotFoundException('Action not found.')
    }

    return {
      id: Action.code,
      name: Action.name,
      description: Action.description,
    }
  }
}
