import { z } from 'zod'

export const getRoleByIdParamsSchema = z.object({
  roleId: z.string(),
})
export type GetRoleByIdParams = z.infer<typeof getRoleByIdParamsSchema>

export interface GetRoleByIdResponse {
  id: string
  name: string
  description: string
}
