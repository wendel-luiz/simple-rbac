import { z } from 'zod'

export const createTenantBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .strip()
export type CreateTenantBody = z.infer<typeof createTenantBodySchema>
