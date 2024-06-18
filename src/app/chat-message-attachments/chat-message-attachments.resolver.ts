import { Resolver } from '@nestjs/graphql';
import { ChatMessageAttachmentsService } from './chat-message-attachments.service';

@Resolver()
export class ChatMessageAttachmentsResolver {
  constructor(
    private readonly chatMessageAttachmentsService: ChatMessageAttachmentsService,
  ) {}
}
