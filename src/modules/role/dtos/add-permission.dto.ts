import { z } from 'zod'

export const addPermissionBodySchema = z
  .object({
    actionId: z.string(),
    resourceId: z.string(),
  })
  .strip()
export type AddPermissionBody = z.infer<typeof addPermissionBodySchema>

export const addPermissionParamSchema = z
  .object({
    roleId: z.string(),
  })
  .strip()
export type AddPermissionParams = z.infer<typeof addPermissionParamSchema>
