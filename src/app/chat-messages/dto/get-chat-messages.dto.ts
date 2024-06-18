import { ChatFileUpload } from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import {
  ArgsType,
  Field,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { Patient } from '@patients/dto/add-patient.dto';
import { PaginationArgs } from '@utils/helpers';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
registerEnumType(SortOrder, { name: 'SortOrder' });

@ObjectType()
export class ChatMessage {
  id: string;
  chatId: string;
  clinicId: string;
  doctorId: string;
  senderId: string;
  message?: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  isRead: boolean;
}

@ObjectType()
export class ChatPatientInfo extends PickType(Patient, ['id', 'fullName']) {}

@ObjectType()
export class ChatMessageData extends PickType(ChatMessage, [
  'id',
  'chatId',
  'message',
  'createdAt',
  'doctorId',
  'clinicId',
  'senderId',
  'isRead',
]) {
  @Field(() => ChatPatientInfo)
  patient: ChatPatientInfo;

  @Field(() => [ChatFileUpload], { nullable: true })
  attachments: ChatFileUpload[];
}

@ObjectType()
export class GetChatMessagesResponse {
  @Field(() => Boolean, { defaultValue: false })
  hasMore: boolean;

  @Field(() => [ChatMessageData], { nullable: true })
  chatMessages: ChatMessageData[];
}

@ArgsType()
export class GetChatMessagesArgs extends PaginationArgs {
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
