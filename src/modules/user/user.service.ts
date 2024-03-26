import { type TenantRepository } from 'modules/tenant/tenant.repository'
import { type UserRepository } from './user.repository'
import {
  BadCredentialsException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'lib/exceptions'
import { generate } from 'short-uuid'
import { addDays } from 'date-fns'
import { type User } from 'database/types'
import { type GetUserByIdResponse } from './dtos/get-by-id.dto'
import { type CreateUserBody } from './dtos/create-user.dto'
import { isPasswordStrong } from './utils/password-validator'
import { hashPassword, isPasswordEqual } from './utils/crypto-password'
import { generateJWT, validateJWT } from './utils/jwt'

export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly tenantRepo: TenantRepository,
  ) {}

  async create(tenantId: string, props: CreateUserBody): Promise<User> {
    const tenant = await this.tenantRepo.findById(tenantId)
    if (tenant == null) {
      throw new NotFoundException('Tenant not found.')
    }

    const isInUse = await this.userRepo.isEmailInUse(props.email)
    if (isInUse) {
      throw new ConflictException('E-mail already in use for this tenant.')
    }

    const isStrong = isPasswordStrong(props.password)
    if (!isStrong) {
      throw new BadRequestException('Password is too weak.')
    }

    const hash = hashPassword(props.password)

    const code = generate()
    const newUser = await this.userRepo.insert({
      ...props,
      password: hash,
      tenantId: tenant.id,
      code,
    })

    return newUser
  }

  async login(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<string> {
    const user = await this.userRepo.findByEmailAndTenant(email, tenantId)
    if (user == null) {
      throw new BadCredentialsException('Wrong credentials.')
    }

    if (!isPasswordEqual(password, user.password)) {
      throw new BadCredentialsException('Wrong credentials.')
    }
    const currentDate = new Date()
    const token = generateJWT(user.code, addDays(currentDate, 1).getTime())

    return token
  }

  async isTokenValid(token: string): Promise<boolean> {
    const isValid = await validateJWT(token)
    return isValid
  }

  async getById(id: string): Promise<GetUserByIdResponse> {
    const user = await this.userRepo.findById(id)

    if (user == null) {
      throw new NotFoundException('User not found.')
    }

    return {
      id: user.code,
      email: user.email,
    }
  }
}
