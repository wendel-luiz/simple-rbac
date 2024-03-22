import { type ZodError } from 'zod'

export function formatZodError(error: ZodError): unknown {
  console.log(error)
  return error.errors.map((error) => ({
    [error.path.join('.')]: error.message,
  }))
}
