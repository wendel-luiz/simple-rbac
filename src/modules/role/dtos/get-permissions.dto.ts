import {
  type PaginatedQuery,
  paginatedQuerySchema,
  type PaginatedResponse,
} from 'lib/paginated'
import { z } from 'zod'

export const getPermissionsParamsSchema = z.object({
  roleId: z.string(),
})
export type GetPermissionsParams = z.infer<typeof getPermissionsParamsSchema>

export const getPermissionsQuerySchema = paginatedQuerySchema
export type GetPermissionsQuery = PaginatedQuery

export interface GetPermissionsResponse
  extends PaginatedResponse<{
    resource: {
      id: string
      name: string
      description: string
    }
    actions: Array<{
      id: string
      name: string
      description: string
    }>
    createdAt: string
  }> {}
