import { z } from 'zod'

export const createUserBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strip()
export type CreateUserBody = z.infer<typeof createUserBodySchema>

export const createUserParamSchema = z
  .object({
    tenantId: z.string(),
  })
  .strip()
export type CreateUserParams = z.infer<typeof createUserParamSchema>
