import {
    mysqlTable,
    bigint,
    index,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";
import { ulid } from "ulid";

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

export const users = mysqlTable("users", {
  id: varchar("id", { length: 100 }).$defaultFn(() => ulid()).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),

})