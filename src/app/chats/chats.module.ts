import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepo } from './chats.repo';
import { ChatMessagesModule } from '@chat-messages/chat-messages.module';

@Module({
  imports: [forwardRef(() => ChatMessagesModule)],
  providers: [ChatsService, ChatsRepo, ChatsResolver],
  exports: [ChatsRepo, ChatsService],
})
export class ChatsModule {}
