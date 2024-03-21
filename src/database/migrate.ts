import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { type Database } from './types'
import { env } from 'config/env.config'

async function migrateToLatest(): Promise<void> {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        database: env.DB_DATABASE,
        host: env.DB_HOST,
        user: env.DB_USER,
        port: env.DB_PORT,
        password: env.DB_PASSWORD,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error != null) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

void migrateToLatest()
