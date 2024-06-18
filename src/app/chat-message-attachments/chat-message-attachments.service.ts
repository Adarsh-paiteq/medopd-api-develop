import { Injectable } from '@nestjs/common';
import { ChatMessageAttachmentsRepo } from './chat-message-attachments.repo';

@Injectable()
export class ChatMessageAttachmentsService {
  constructor(
    private readonly chatMessageAttachmentsRepo: ChatMessageAttachmentsRepo,
  ) {}
}
