import { Module } from '@nestjs/common';
import { ChatMessageAttachmentsResolver } from './chat-message-attachments.resolver';
import { ChatMessageAttachmentsService } from './chat-message-attachments.service';
import { ChatMessageAttachmentsRepo } from './chat-message-attachments.repo';

@Module({
  providers: [
    ChatMessageAttachmentsResolver,
    ChatMessageAttachmentsService,
    ChatMessageAttachmentsRepo,
  ],
  exports: [ChatMessageAttachmentsRepo],
})
export class ChatMessageAttachmentsModule {}
