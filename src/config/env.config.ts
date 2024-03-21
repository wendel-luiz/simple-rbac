import { InternalServerError } from 'lib/exceptions'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.string(),
  DB_PORT: z.string().transform((value) => Number(value)),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
})
type Env = z.infer<typeof envSchema>

class Environment {
  private readonly props: Env

  constructor() {
    const values = envSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      DB_PORT: process.env.DB_PORT,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
    })

    if (!values.success) {
      console.error(values.error)
      throw new InternalServerError('Error validating env file.')
    }

    this.props = values.data
  }

  public get NODE_ENV(): string {
    return this.props.NODE_ENV
  }

  public get DB_PORT(): number {
    return this.props.DB_PORT
  }

  public get DB_HOST(): string {
    return this.props.DB_HOST
  }

  public get DB_USER(): string {
    return this.props.DB_USER
  }

  public get DB_PASSWORD(): string {
    return this.props.DB_PASSWORD
  }

  public get DB_DATABASE(): string {
    return this.props.DB_DATABASE
  }
}

export const env = new Environment()
