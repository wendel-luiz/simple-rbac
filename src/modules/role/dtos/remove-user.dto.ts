import { z } from 'zod'

export const removeUserBodySchema = z
  .object({
    userId: z.string(),
  })
  .strip()
export type RemoveUserBody = z.infer<typeof removeUserBodySchema>

export const removeUserParamSchema = z
  .object({
    roleId: z.string(),
  })
  .strip()
export type RemoveUserParams = z.infer<typeof removeUserParamSchema>
