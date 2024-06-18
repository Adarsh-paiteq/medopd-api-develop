import { chatsTable } from '@chats/chats.schema';
import { clinicsTable } from '@clinics/clinics.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'chat_messages';
export const chatMessagesTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  chatId: text('chat_id')
    .notNull()
    .references(() => chatsTable.id),
  clinicId: text('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctorsTable.id),
  senderId: text('sender_id').notNull(),
  message: text('message'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
});

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
