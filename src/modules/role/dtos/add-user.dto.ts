import { z } from 'zod'

export const addUserBodySchema = z
  .object({
    userId: z.string(),
  })
  .strip()
export type AddUserBody = z.infer<typeof addUserBodySchema>

export const addUserParamSchema = z
  .object({
    roleId: z.string(),
  })
  .strip()
export type AddUserParams = z.infer<typeof addUserParamSchema>
