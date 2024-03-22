import { z } from 'zod'

// Create User
export const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type CreateUserBody = z.infer<typeof createUserBodySchema>

export const createUserParamSchema = z.object({
  tenantId: z.string(),
})
export type CreateUserParams = z.infer<typeof createUserParamSchema>

export interface CreateUserResponse {
  id: string
  email: string
  tenantId: string
}

// Find User By Id
