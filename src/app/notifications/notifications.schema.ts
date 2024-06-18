import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'notifications';
export const notificationsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  receiverId: text('receiver_id').notNull(),
  senderId: text('sender_id'),
  body: text('body').notNull(),
  title: text('title').notNull(),
  page: text('page'),
  isRead: boolean('is_read').default(false).notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdateFn(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Notification = typeof notificationsTable.$inferSelect;
