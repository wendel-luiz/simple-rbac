import { z } from 'zod'

export const getResourceByIdParamsSchema = z.object({
  resourceId: z.string(),
})
export type GetResourceByIdParams = z.infer<typeof getResourceByIdParamsSchema>

export interface GetResourceByIdResponse {
  id: string
  name: string
  description: string
}
