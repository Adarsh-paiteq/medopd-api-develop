import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
const tableName = 'admins';
export const adminsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  fullName: text('full_name').notNull(),
  earningBalance: numeric('earning_balance', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  refreshToken: text('refresh_token'),
});

export type Admin = typeof adminsTable.$inferSelect;
