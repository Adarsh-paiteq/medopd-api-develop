import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  ValidateIf,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';
import {
  CHATFILETYPE,
  ChatFileType,
  ChatMessageAttachment,
} from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import { ChatMessage, ChatMessageData } from './get-chat-messages.dto';
import { Chat } from '@chats/dto/get-chat.dto';

@InputType()
export class ChatMessageAttachmentInput {
  @IsNotEmpty()
  @IsString()
  fileId: string;

  @IsNotEmpty()
  @IsString()
  filePath: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @Field(() => CHATFILETYPE)
  @IsNotEmpty()
  @IsEnum(CHATFILETYPE)
  fileType: ChatFileType;

  @ValidateIf(
    (input: ChatMessageAttachment) => input.fileType === CHATFILETYPE.VIDEO,
  )
  @IsString()
  thumbnailImageUrl?: string;

  @ValidateIf(
    (input: ChatMessageAttachment) => input.fileType === CHATFILETYPE.VIDEO,
  )
  @IsString()
  thumbnailImageId?: string;

  @ValidateIf(
    (input: ChatMessageAttachment) => input.fileType === CHATFILETYPE.VIDEO,
  )
  @IsString()
  thumbnailImageIdPath?: string;
}

@InputType()
export class CreateChatMessageInput {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ValidateIf((input: CreateChatMessageInput) => !input.attachments?.length)
  @IsString()
  message?: string;

  @Field(() => [ChatMessageAttachmentInput], {
    nullable: true,
  })
  @Type(() => ChatMessageAttachmentInput)
  @ValidateNested()
  attachments?: ChatMessageAttachmentInput[];
}

@ObjectType()
export class CreateChatMessageResponse {
  @Field(() => ChatMessageData)
  chatMessage: ChatMessageData;

  @Field(() => Chat)
  chat: Chat;
}

export class CreateChatMessageDTO extends PickType(ChatMessage, [
  'chatId',
  'message',
  'doctorId',
  'clinicId',
  'senderId',
]) {}

export class CreateChatMessageAttachmentDTO extends PickType(
  ChatMessageAttachment,
  [
    'chatId',
    'chatMessageId',
    'senderId',
    'fileId',
    'filePath',
    'fileType',
    'fileUrl',
    'thumbnailImageId',
    'thumbnailImageIdPath',
    'thumbnailImageUrl',
  ],
) {}
