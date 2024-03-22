import { z } from 'zod'

export const createTenantSchema = z
  .object({
    name: z.string(),
    description: z.string(),
  })
  .strip()
export type CreateTenant = z.infer<typeof createTenantSchema>
