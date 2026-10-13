// src/db/schema/schools.ts
import {
  bigint,
  mysqlTable,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core'

export const schools = mysqlTable(
  'schools',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .autoincrement()
      .primaryKey(),

    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 30 }),
    currency: varchar('currency', { length: 3 })
      .notNull()
      .default('TZS'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('schools_code_uq').on(table.code),
    index('schools_name_idx').on(table.name),
  ],
)

export type School = typeof schools.$inferSelect
export type NewSchool = typeof schools.$inferInsert