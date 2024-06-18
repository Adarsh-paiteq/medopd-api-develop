import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ChatMessage, chatMessagesTable } from './chat-messages.schema';
import { ulid } from 'ulid';
import { CreateChatMessageDTO } from './dto/create-chat-message.dto';
import {
  ChatMessageData,
  GetChatMessagesArgs,
} from './dto/get-chat-messages.dto';
import { count, eq, sql, and, desc, ne } from 'drizzle-orm';
import { chatMessageAttachmentsTable } from '@chat-message-attachments/chat-message-attachments.schema';
import { patientsTable } from '@patients/patients.schema';
import { chatsTable } from '@chats/chats.schema';
import { ChatDetails } from './dto/get-chat-message.dto';
import { LastChatMessageData } from '@chats/dto/get-chat-list.dto';

@Injectable()
export class ChatMessagesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      chatMessagesTable: typeof chatMessagesTable;
    }>,
  ) {}
  async createChatMessage(
    createChatMessage: CreateChatMessageDTO,
  ): Promise<ChatMessage> {
    const [result] = await this.db
      .insert(chatMessagesTable)
      .values({
        ...createChatMessage,
        id: ulid(),
      })
      .returning();
    return result;
  }

  async getChatMessages(
    args: GetChatMessagesArgs,
  ): Promise<{ chatMessages: ChatMessageData[]; total: number }> {
    const { chatId, limit, page, sortOrder } = args;
    const offset = (page - 1) * limit;
    const [chatMessagesQuery, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: chatMessagesTable.id,
          chatId: chatMessagesTable.chatId,
          message: chatMessagesTable.message,
          createdAt: chatMessagesTable.createdAt,
          doctorId: chatMessagesTable.doctorId,
          clinicId: chatMessagesTable.clinicId,
          senderId: chatMessagesTable.senderId,
          isRead: chatMessagesTable.isRead,
          patient: {
            id: patientsTable.id,
            fullName: patientsTable.fullName,
          },
        })
        .from(chatMessagesTable)
        .innerJoin(chatsTable, eq(chatMessagesTable.chatId, chatsTable.id))
        .innerJoin(patientsTable, eq(chatsTable.patientId, patientsTable.id))
        .where(
          and(
            eq(chatMessagesTable.chatId, chatId),
            eq(chatMessagesTable.isDeleted, false),
          ),
        )
        .orderBy(
          sql`${chatMessagesTable.createdAt} ${sql.raw(sortOrder)} NULLS FIRST`,
        )
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: count() })
        .from(chatMessagesTable)
        .where(eq(chatMessagesTable.chatId, chatId)),
    ]);
    // Fetch attachments for each chat message concurrently
    const chatMessages = await Promise.all(
      chatMessagesQuery.map(async (message) => {
        const attachments = await this.db
          .select({
            id: chatMessageAttachmentsTable.id,
            fileUrl: chatMessageAttachmentsTable.fileUrl,
            fileId: chatMessageAttachmentsTable.fileId,
            filePath: chatMessageAttachmentsTable.filePath,
            fileType: chatMessageAttachmentsTable.fileType,
            thumbnailImageUrl: chatMessageAttachmentsTable.thumbnailImageUrl,
            thumbnailImageId: chatMessageAttachmentsTable.thumbnailImageId,
            thumbnailImageIdPath:
              chatMessageAttachmentsTable.thumbnailImageIdPath,
          })
          .from(chatMessageAttachmentsTable)
          .where(eq(chatMessageAttachmentsTable.chatMessageId, message.id));

        return {
          ...message,
          attachments: attachments,
        };
      }),
    );
    return { chatMessages: chatMessages, total };
  }

  async getChatDetails(id: string): Promise<ChatDetails | undefined> {
    const [chat] = await this.db
      .select({
        id: chatsTable.id,
        createdAt: chatsTable.createdAt,
        doctorId: chatsTable.doctorId,
        clinicId: chatsTable.clinicId,
        patientId: chatsTable.patientId,
        bookingId: chatsTable.bookingId,
        isDeleted: chatsTable.isDeleted,
        updatedAt: chatsTable.updatedAt,
        patient: {
          id: patientsTable.id,
          fullName: patientsTable.fullName,
        },
      })
      .from(chatsTable)
      .innerJoin(patientsTable, eq(chatsTable.patientId, patientsTable.id))
      .where(eq(chatsTable.id, id));
    return chat;
  }

  async getLastChatMessage(
    chatId: string,
  ): Promise<LastChatMessageData | undefined> {
    const [lastMessage] = await this.db
      .select({
        id: chatMessagesTable.id,
        chatId: chatMessagesTable.chatId,
        message: chatMessagesTable.message,
        createdAt: chatMessagesTable.createdAt,
        doctorId: chatMessagesTable.doctorId,
        clinicId: chatMessagesTable.clinicId,
        senderId: chatMessagesTable.senderId,
        patient: {
          id: patientsTable.id,
          fullName: patientsTable.fullName,
        },
        attachments: {
          id: chatMessageAttachmentsTable.id,
          fileUrl: chatMessageAttachmentsTable.fileUrl,
          fileId: chatMessageAttachmentsTable.fileId,
          filePath: chatMessageAttachmentsTable.filePath,
          fileType: chatMessageAttachmentsTable.fileType,
          thumbnailImageUrl: chatMessageAttachmentsTable.thumbnailImageUrl,
          thumbnailImageId: chatMessageAttachmentsTable.thumbnailImageId,
          thumbnailImageIdPath:
            chatMessageAttachmentsTable.thumbnailImageIdPath,
        },
      })
      .from(chatMessagesTable)
      .innerJoin(chatsTable, eq(chatMessagesTable.chatId, chatsTable.id))
      .innerJoin(patientsTable, eq(chatsTable.patientId, patientsTable.id))
      .leftJoin(
        chatMessageAttachmentsTable,
        eq(chatMessagesTable.id, chatMessageAttachmentsTable.chatMessageId),
      )
      .where(
        and(
          eq(chatMessagesTable.chatId, chatId),
          eq(chatMessagesTable.isDeleted, false),
        ),
      )
      .orderBy(desc(chatMessagesTable.createdAt))
      .limit(1);
    return lastMessage;
  }

  async readChatMessages(chatId: string, senderId: string): Promise<void> {
    await this.db
      .update(chatMessagesTable)
      .set({
        isRead: true,
      })
      .where(
        and(
          eq(chatMessagesTable.chatId, chatId),
          eq(chatMessagesTable.isRead, false),
          ne(chatMessagesTable.senderId, senderId),
        ),
      );
  }
}
