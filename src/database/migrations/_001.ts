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
    .addColumn('email', 'text', (col) => col.notNull())
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
    .addColumn('name', 'text', (col) => col.notNull())
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

  await db.schema
    .createTable('resource')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('tenantId', 'integer', (col) =>
      col.references('tenant.id').onDelete('cascade').notNull(),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('resource_code_index')
    .on('resource')
    .column('code')
    .execute()

  await db.schema
    .createTable('action')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('tenantId', 'integer', (col) =>
      col.references('tenant.id').onDelete('cascade').notNull(),
    )
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updatedAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createIndex('action_code_index')
    .on('action')
    .column('code')
    .execute()

  await db.schema
    .createTable('userRole')
    .addColumn('userId', 'integer', (col) =>
      col.references('user.id').onDelete('cascade').notNull(),
    )
    .addColumn('roleId', 'integer', (col) =>
      col.references('role.id').onDelete('cascade').notNull(),
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()

  await db.schema
    .createTable('permission')
    .addColumn('roleId', 'integer', (col) =>
      col.references('role.id').onDelete('cascade').notNull(),
    )
    .addColumn('actionId', 'integer', (col) =>
      col.references('action.id').onDelete('cascade').notNull(),
    )
    .addColumn('resourceId', 'integer', (col) =>
      col.references('resource.id').onDelete('cascade').notNull(),
    )
    .addColumn('createdAt', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tenant').execute()
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('role').execute()
  await db.schema.dropTable('resource').execute()
  await db.schema.dropTable('action').execute()
  await db.schema.dropTable('userRole').execute()
  await db.schema.dropTable('permission').execute()
}
