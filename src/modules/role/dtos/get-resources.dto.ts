import {
  type PaginatedQuery,
  paginatedQuerySchema,
  type PaginatedResponse,
} from 'lib/paginated'
import { z } from 'zod'

export const getResourcesParamsSchema = z.object({
  roleId: z.string(),
})
export type GetResourcesParams = z.infer<typeof getResourcesParamsSchema>

export const getResourcesQuerySchema = paginatedQuerySchema
export type GetResourcesQuery = PaginatedQuery

export interface GetResourcesResponse
  extends PaginatedResponse<{
    id: string
    name: string
    description: string
  }> {}
