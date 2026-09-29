import {
    mysqlTable,
    bigint,
    index,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";

export const posts = mysqlTable(
  'posts',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .autoincrement()
      .primaryKey(),

    title: varchar('title', { length: 255 }).notNull(),

    content: text('content').notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
  }),
)