// src/db/schema/school-members.ts

import {
  bigint,
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'

import { schools } from '#/database/schema/schools.ts'
import { users } from '#/database/schema/users.ts'
import { ulid } from 'ulid'

export const schoolMembers = mysqlTable(
  'school_members',
  {
    id: varchar('id', { length: 100 })
      .$defaultFn(() => ulid())
      .primaryKey(),

    schoolId: bigint('school_id', {
      mode: 'number',
      unsigned: true,
    })
      .notNull()
      .references(() => schools.id, { onDelete: 'cascade' }),
    userId: bigint('user_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    role: mysqlEnum('role', [
      'admin',
      'accountant',
      'viewer',
    ])
      .notNull()
      .default('viewer'),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('school_members_school_user_uq').on(
      table.schoolId,
      table.userId,
    ),
    index('school_members_school_role_idx').on(
      table.schoolId,
      table.role,
    ),
  ],
)