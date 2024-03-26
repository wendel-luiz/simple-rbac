import { z } from 'zod'

export const removePermissionBodySchema = z
  .object({
    actionId: z.string(),
    resourceId: z.string(),
  })
  .strip()
export type RemovePermissionBody = z.infer<typeof removePermissionBodySchema>

export const removePermissionParamSchema = z
  .object({
    roleId: z.string(),
  })
  .strip()
export type RemovePermissionParams = z.infer<typeof removePermissionParamSchema>
