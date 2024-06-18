import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateChatInputDto } from './dto/create-chat.dto';
import { Chat, chatsTable } from './chats.schema';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { ulid } from 'ulid';
import { and, count, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import { patientsTable } from '@patients/patients.schema';
import { ChatMessagesRepo } from '@chat-messages/chat-messages.repo';
import { ChatList } from './dto/get-chat-list.dto';
import { chatMessagesTable } from '@chat-messages/chat-messages.schema';

@Injectable()
export class ChatsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      chatsTable: typeof chatsTable;
    }>,
    private readonly chatMessagesRepo: ChatMessagesRepo,
  ) {}

  async createChat(createChat: CreateChatInputDto): Promise<Chat> {
    const [result] = await this.db
      .insert(chatsTable)
      .values({
        ...createChat,
        id: ulid(),
      })
      .returning();
    return result;
  }

  async getChatById(chatId: string): Promise<Chat | undefined> {
    const [chat] = await this.db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.isDeleted, false)));
    return chat;
  }

  async getChatList(
    userId: string,
    page: number,
    limit: number,
    fullName?: string,
  ): Promise<{
    chatList: ChatList[];
    total: number;
    totalUnreadMessages: number;
  }> {
    const offset = (page - 1) * limit;
    const commonWhereClause = fullName
      ? and(
          or(eq(chatsTable.clinicId, userId), eq(chatsTable.doctorId, userId)),
          eq(chatsTable.isDeleted, false),
          ilike(patientsTable.fullName, sql.placeholder(`fullName`)),
        )
      : and(
          or(eq(chatsTable.clinicId, userId), eq(chatsTable.doctorId, userId)),
          eq(chatsTable.isDeleted, false),
        );

    const builderWithPagination = this.db
      .select({
        patientId: patientsTable.id,
        patientFullName: patientsTable.fullName,
        chatId: chatsTable.id,
      })
      .from(chatsTable)
      .innerJoin(patientsTable, eq(patientsTable.id, chatsTable.patientId))
      .where(commonWhereClause)
      .orderBy(desc(chatsTable.createdAt))
      .offset(offset)
      .limit(limit);

    const builderWithoutPagination = this.db
      .select({
        total: count(),
      })
      .from(chatsTable)
      .innerJoin(patientsTable, eq(patientsTable.id, chatsTable.patientId))
      .where(commonWhereClause);
    const queryWithPagination = builderWithPagination.prepare('chats');
    const queryWithoutPagination = builderWithoutPagination.prepare('total');
    const executeOptions: Parameters<typeof queryWithPagination.execute>[0] =
      {};
    if (fullName) {
      executeOptions.fullName = `%${fullName}%`;
    }
    const [chatsQuery, [{ total }]] = await Promise.all([
      queryWithPagination.execute(executeOptions),
      queryWithoutPagination.execute(executeOptions),
    ]);
    const chatList = await Promise.all(
      chatsQuery.map(async (chat) => {
        const [lastMessage, [{ unreadMessagesCount }]] = await Promise.all([
          this.chatMessagesRepo.getLastChatMessage(chat.chatId),
          this.db
            .select({ unreadMessagesCount: count() })
            .from(chatMessagesTable)
            .where(
              and(
                eq(chatMessagesTable.chatId, chat.chatId),
                eq(chatMessagesTable.isRead, false),
                ne(chatMessagesTable.senderId, userId),
              ),
            ),
        ]);
        return {
          id: chat.patientId,
          fullName: chat.patientFullName,
          chatId: chat.chatId,
          lastMessage,
          unreadMessagesCount,
        };
      }),
    );
    const [{ totalUnreadMessages }] = await this.db
      .select({
        totalUnreadMessages: count(),
      })
      .from(chatMessagesTable)
      .where(
        and(
          or(
            eq(chatMessagesTable.clinicId, userId),
            eq(chatMessagesTable.doctorId, userId),
          ),
          eq(chatMessagesTable.isRead, false),
          ne(chatMessagesTable.senderId, userId),
        ),
      );
    return {
      chatList,
      total: total,
      totalUnreadMessages,
    };
  }
}
