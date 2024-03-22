import { z } from 'zod'

export const validateTokenBodySchema = z
  .object({
    token: z.string(),
  })
  .strip()
export type ValidateTokenBody = z.infer<typeof validateTokenBodySchema>
