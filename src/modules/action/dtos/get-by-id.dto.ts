import { z } from 'zod'

export const getActionByIdParamsSchema = z.object({
  actionId: z.string(),
})
export type GetActionByIdParams = z.infer<typeof getActionByIdParamsSchema>

export interface GetActionByIdResponse {
  id: string
  name: string
  description: string
}
