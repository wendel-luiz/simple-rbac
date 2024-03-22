import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tenant')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('name', 'text')
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('tenant_code_index')
    .on('tenant')
    .column('code')
    .execute()

  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('tenantId', 'integer', (col) =>
      col.references('tenant.id').onDelete('cascade').notNull(),
    )
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('user_code_index')
    .on('user')
    .column('code')
    .execute()

  await db.schema
    .createTable('role')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('tenantId', 'integer', (col) =>
      col.references('tenant.id').onDelete('cascade').notNull(),
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('role_code_index')
    .on('role')
    .column('code')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tenant').execute()
  await db.schema.dropTable('user').execute()
}
