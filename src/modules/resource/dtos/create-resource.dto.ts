import { z } from 'zod'

export const createResourceBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .strip()
export type CreateResourceBody = z.infer<typeof createResourceBodySchema>

export const createResourceParamSchema = z
  .object({
    tenantId: z.string(),
  })
  .strip()
export type CreateResourceParams = z.infer<typeof createResourceParamSchema>
