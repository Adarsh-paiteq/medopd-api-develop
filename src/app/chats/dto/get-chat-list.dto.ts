import { ChatFileUpload } from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import {
  ChatMessage,
  ChatPatientInfo,
} from '@chat-messages/dto/get-chat-messages.dto';
import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { Patient } from '@patients/dto/add-patient.dto';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetChatListArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  search?: string;
}

@ObjectType()
export class LastChatMessageData extends PickType(ChatMessage, [
  'id',
  'chatId',
  'message',
  'createdAt',
  'doctorId',
  'clinicId',
  'senderId',
]) {
  @Field(() => ChatPatientInfo)
  patient: ChatPatientInfo;

  @Field(() => ChatFileUpload, { nullable: true })
  attachments: ChatFileUpload | null;
}

@ObjectType()
export class ChatList extends PickType(Patient, ['id', 'fullName']) {
  chatId: string;
  @Field(() => LastChatMessageData, { nullable: true })
  lastMessage?: LastChatMessageData | null;
  unreadMessagesCount: number;
}

@ObjectType()
export class GetChatList {
  @Field(() => [ChatList], { nullable: true })
  chatList: ChatList[];
  totalUnreadMessages: number;
  hasMore: boolean;
}
