import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import type { WebAuthnCredential } from '#auth-utils'

const timestampColumns = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()), // Auto-set on create
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()), // Auto-set on create (needs trigger or manual update for 'on update')
}

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }), // Can be null if never logged in
  ...timestampColumns,
})

export const credentials = sqliteTable('credentials', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  id: text('id').notNull().unique(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  backedUp: integer('backed_up', { mode: 'boolean' }).notNull(),
  transports: text('transports', { mode: 'json' }).notNull().$type<WebAuthnCredential['transports']>(),
  ...timestampColumns,
}, table => ({
  pk: unique().on(table.userId, table.id),
}))

/**
 * Relations (useful for queries)
 */
export const usersRelations = relations(users, ({ many }) => ({
  credentials: many(credentials),
}))

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.userId],
    references: [users.id],
  }),
}))
