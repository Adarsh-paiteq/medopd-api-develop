import { Module, forwardRef } from '@nestjs/common';
import { ChatMessagesResolver } from './chat-messages.resolver';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesRepo } from './chat-messages.repo';
import { ChatsModule } from '@chats/chats.module';
import { ChatMessageAttachmentsModule } from '@chat-message-attachments/chat-message-attachments.module';
import { PatientsModule } from '@patients/patients.module';

@Module({
  imports: [
    forwardRef(() => ChatsModule),
    ChatMessageAttachmentsModule,
    PatientsModule,
  ],
  providers: [ChatMessagesResolver, ChatMessagesService, ChatMessagesRepo],
  exports: [ChatMessagesRepo, ChatMessagesService],
})
export class ChatMessagesModule {}
