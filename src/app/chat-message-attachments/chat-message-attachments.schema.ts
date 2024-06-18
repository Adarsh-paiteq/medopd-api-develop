import { chatMessagesTable } from '@chat-messages/chat-messages.schema';
import { chatsTable } from '@chats/chats.schema';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
export const FileTypeEnum = pgEnum('file_type', [
  'IMAGE',
  'VIDEO',
  'DOCUMENT',
  'AUDIO',
]);
const tableName = 'chat_message_attachments';
export const chatMessageAttachmentsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  chatId: text('chat_id')
    .notNull()
    .references(() => chatsTable.id),
  chatMessageId: text('chat_message_id')
    .notNull()
    .references(() => chatMessagesTable.id),
  senderId: text('sender_id').notNull(),
  fileId: text('file_id').notNull(),
  filePath: text('file_path').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: FileTypeEnum('file_type').notNull(),
  thumbnailImageUrl: text('thumbnail_image_url'),
  thumbnailImageId: text('thumbnail_image_id'),
  thumbnailImageIdPath: text('thumbnail_image_id_path'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ChatMessageAttachment =
  typeof chatMessageAttachmentsTable.$inferSelect;
