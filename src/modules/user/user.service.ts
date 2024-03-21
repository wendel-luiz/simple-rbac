import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type UserRepository } from './user.repository'
import { type CreateUser } from './user.types'
import { InternalServerError, NotFoundException } from 'lib/exceptions'

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateUser): Promise<void> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const user = await this.userRepo.insert({ ...props, tenantId })
    if (user == null) {
      throw new InternalServerError('Error while inserting a new user.')
    }
  }
}
