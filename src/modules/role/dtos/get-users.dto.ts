import {
  type PaginatedQuery,
  paginatedQuerySchema,
  type PaginatedResponse,
} from 'lib/paginated'
import { z } from 'zod'

export const getUsersParamsSchema = z.object({
  roleId: z.string(),
})
export type GetUsersParams = z.infer<typeof getUsersParamsSchema>

export const getUsersQuerySchema = paginatedQuerySchema
export type GetUsersQuery = PaginatedQuery

export interface GetUsersResponse
  extends PaginatedResponse<{
    id: string
    email: string
    addedAt: string
  }> {}
