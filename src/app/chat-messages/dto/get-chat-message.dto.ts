import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ChatMessageData,
  ChatPatientInfo,
  SortOrder,
} from './get-chat-messages.dto';
import { Chat } from '@chats/dto/get-chat.dto';

@ArgsType()
export class GetChatArgs extends PaginationArgs {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @Field(() => SortOrder, {
    nullable: true,
    defaultValue: SortOrder.ASC,
    description: `SortOrder must be ${Object.values(SortOrder)}`,
  })
  sortOrder: SortOrder;
}

@ObjectType()
export class ChatDetails extends Chat {
  @Field(() => ChatPatientInfo)
  patient: ChatPatientInfo;
}

@ObjectType()
export class GetChatResponse {
  @Field(() => ChatDetails)
  chat: ChatDetails;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Boolean, { defaultValue: false })
  hasMore: boolean;

  @Field(() => [ChatMessageData], { nullable: true })
  chatMessages: ChatMessageData[];
}
