import { z } from 'zod'

export const createRoleBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .strip()
export type CreateRoleBody = z.infer<typeof createRoleBodySchema>

export const createRoleParamSchema = z
  .object({
    tenantId: z.string(),
  })
  .strip()
export type CreateRoleParams = z.infer<typeof createRoleParamSchema>
