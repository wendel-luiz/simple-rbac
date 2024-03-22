import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type UserRepository } from './user.repository'
import { type CreateUserResponse, type CreateUserBody } from './user.types'
import { InternalServerError, NotFoundException } from 'lib/exceptions'
import { generate } from 'short-uuid'

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(
    tenantId: string,
    props: CreateUserBody,
  ): Promise<CreateUserResponse> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const user = await this.userRepo.insert({
      ...props,
      tenantId: tenant.id,
      code: generate(),
    })

    if (user == null) {
      throw new InternalServerError('Error while inserting a new user.')
    }

    return {
      id: user.code,
      email: user.email,
      tenantId: tenant.code,
    }
  }
}
