import { ObjectValue } from '@clinics/dto/send-otp-login-register.dto';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
export const CHATFILETYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  AUDIO: 'AUDIO',
} as const;

export type ChatFileType = ObjectValue<typeof CHATFILETYPE>;
registerEnumType(CHATFILETYPE, {
  name: 'ChatFileType',
});

@ObjectType()
export class ChatFileUpload {
  id: string;
  fileUrl: string;
  fileId: string;
  filePath: string;
  @Field(() => CHATFILETYPE)
  fileType: ChatFileType;
  thumbnailImageUrl?: string | null;
  thumbnailImageId?: string | null;
  thumbnailImageIdPath?: string | null;
}

@ObjectType()
export class ChatMessageAttachment {
  id: string;
  chatId: string;
  chatMessageId: string;
  senderId: string;
  fileId: string;
  filePath: string;
  fileUrl: string;
  @Field(() => CHATFILETYPE)
  fileType: ChatFileType;
  thumbnailImageUrl?: string | null;
  thumbnailImageId?: string | null;
  thumbnailImageIdPath?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
