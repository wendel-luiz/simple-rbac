import {
  type PaginatedQuery,
  paginatedQuerySchema,
  type PaginatedResponse,
} from 'lib/paginated'
import { z } from 'zod'

export const getActionsByResourceParamsSchema = z.object({
  roleId: z.string(),
  resourceId: z.string(),
})
export type GetActionsByResourceParams = z.infer<
  typeof getActionsByResourceParamsSchema
>

export const getActionsByResourceQuerySchema = paginatedQuerySchema
export type GetActionsByResourceQuery = PaginatedQuery

export interface GetActionsByResourceResponse
  extends PaginatedResponse<{
    id: string
    name: string
    action: string
    description: string
  }> {}
