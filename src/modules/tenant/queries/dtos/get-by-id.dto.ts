import { z } from 'zod'

export const getTenantByIdParamsSchema = z.object({
  tenantId: z.string(),
})
export type GetTenantByIdParams = z.infer<typeof getTenantByIdParamsSchema>

export interface GetTenantByIdResponse {
  id: string
  name: string
  description: string
}
