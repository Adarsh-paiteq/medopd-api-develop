import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChatsRepo } from './chats.repo';
import { JoinChatRoomBody } from './dto/join-chat-room.dto';
import { SocketClient } from '@core/middlewares/ws-auth.middleware';
import { WEBSOCKET_CLIENT_EVENT } from '@core/constants/websocket-events';
import { Server as SocketIOServer } from 'socket.io';
import { GetChatList, GetChatListArgs } from './dto/get-chat-list.dto';
import { ChatMessagesService } from '@chat-messages/chat-messages.service';
import { CreateChatMessageInput } from '@chat-messages/dto/create-chat-message.dto';
@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepo: ChatsRepo,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  async joinSocketChatRoom(
    body: JoinChatRoomBody,
    client: SocketClient,
  ): Promise<void> {
    const { chatId } = body;
    const userId = client.user.id;
    const chat = await this.chatsRepo.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat Not found`);
    }
    await client.join(chat.id);
    this.logger.log(`user joined room`);
    await client.emitWithAck(WEBSOCKET_CLIENT_EVENT.CHATS_JOIN_ACK(userId), {
      chatId,
    });
  }

  async sendSocketChatMessage(
    input: CreateChatMessageInput,
    client: SocketClient,
    server: SocketIOServer,
  ): Promise<void> {
    const { chatId } = input;
    const userId = client.user.id;
    const { chatMessage } = await this.chatMessagesService.createChatMessage(
      userId,
      input,
    );
    this.logger.log(`chat message stored in database`);
    server
      .to(chatId)
      .emit(WEBSOCKET_CLIENT_EVENT.CHATS_MESSAGE(chatId), chatMessage);
    this.logger.log(`chat message sent in room`);
  }

  async getChatList(
    userId: string,
    args: GetChatListArgs,
  ): Promise<GetChatList> {
    const { search, page, limit } = args;
    const { chatList, total, totalUnreadMessages } =
      await this.chatsRepo.getChatList(userId, page, limit, search);

    const hasMore = total > page * limit;
    return {
      chatList,
      totalUnreadMessages,
      hasMore,
    };
  }
}
