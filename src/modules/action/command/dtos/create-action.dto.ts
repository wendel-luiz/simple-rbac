import { z } from 'zod'

export const createActionBodySchema = z
  .object({
    action: z.string(),
    name: z.string(),
    description: z.string(),
  })
  .strip()
export type CreateActionBody = z.infer<typeof createActionBodySchema>

export const createActionParamSchema = z
  .object({
    tenantId: z.string(),
  })
  .strip()
export type CreateActionParams = z.infer<typeof createActionParamSchema>
