import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  ChatMessageAttachment,
  chatMessageAttachmentsTable,
} from './chat-message-attachments.schema';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { ulid } from 'ulid';
import { CreateChatMessageAttachmentDTO } from '@chat-messages/dto/create-chat-message.dto';

@Injectable()
export class ChatMessageAttachmentsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      chatMessageAttachmentsTable: typeof chatMessageAttachmentsTable;
    }>,
  ) {}

  async createChatAttachments(
    createChatMessageAttachments: CreateChatMessageAttachmentDTO[],
  ): Promise<ChatMessageAttachment[]> {
    const values = createChatMessageAttachments.map<ChatMessageAttachment>(
      (attachment) => ({
        id: ulid(),
        updatedAt: new Date(),
        createdAt: new Date(),
        chatId: attachment.chatId,
        chatMessageId: attachment.chatMessageId,
        senderId: attachment.senderId,
        fileId: attachment.fileId,
        filePath: attachment.filePath,
        fileType: attachment.fileType,
        fileUrl: attachment.fileUrl,
        thumbnailImageId: attachment.thumbnailImageId || null,
        thumbnailImageIdPath: attachment.thumbnailImageIdPath || null,
        thumbnailImageUrl: attachment.thumbnailImageUrl || null,
      }),
    );
    const result = await this.db
      .insert(chatMessageAttachmentsTable)
      .values(values)
      .returning();
    return result;
  }
}
