import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { type Database } from './types'
import { env } from 'config/env.config'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    user: env.DB_USER,
    port: env.DB_PORT,
    password: env.DB_PASSWORD,
    max: 10,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
