import { z } from 'zod'

export const getUserByIdParamsSchema = z.object({
  userId: z.string(),
})
export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>

export interface GetUserByIdResponse {
  id: string
  email: string
}
