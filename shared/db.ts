import type { tables } from '~~/server/utils/db'

export type User = typeof tables.users.$inferSelect
