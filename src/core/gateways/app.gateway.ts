import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server as SocketIOServer } from 'socket.io';
import * as dotenv from 'dotenv';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  SocketClient,
  WSAuthMiddleware,
} from '@core/middlewares/ws-auth.middleware';
import { ChatsService } from '@chats/chats.service';
import { WEBSOCKET_SERVER_EVENT } from '../constants/websocket-events';
import { AuthService } from '@core/services/auth.service';
import { JoinChatRoomBody } from '@chats/dto/join-chat-room.dto';
import { CreateChatMessageInput } from '@chat-messages/dto/create-chat-message.dto';

dotenv.config();
const wsPort = parseInt(<string>process.env.WEB_SOCKET_PORT);

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
@WebSocketGateway(wsPort, { namespace: 'ws', cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly chatsService: ChatsService,
  ) {}

  @WebSocketServer()
  private readonly server: SocketIOServer;

  afterInit(server: SocketIOServer): void {
    const authMiddleware = WSAuthMiddleware(this.authService, this.logger);
    server.use(authMiddleware);
    this.logger.log(`${AppGateway.name} init`);
  }

  handleConnection(client: SocketClient): void {
    this.logger.log(`Client id: ${client?.user?.id} connected`);
  }

  handleDisconnect(client: SocketClient): void {
    this.logger.log(`Cliend id:${client?.user.id} disconnected`);
  }

  @SubscribeMessage(WEBSOCKET_SERVER_EVENT.CHATS_JOIN)
  async handleJoin(
    @MessageBody() data: JoinChatRoomBody,
    @ConnectedSocket() client: SocketClient,
  ): Promise<void> {
    return await this.chatsService.joinSocketChatRoom(data, client);
  }

  @SubscribeMessage(WEBSOCKET_SERVER_EVENT.CHATS_MESSAGES)
  async handleSendChatMessage(
    @MessageBody() data: CreateChatMessageInput,
    @ConnectedSocket() client: SocketClient,
  ): Promise<void> {
    return await this.chatsService.sendSocketChatMessage(
      data,
      client,
      this.server,
    );
  }
}
