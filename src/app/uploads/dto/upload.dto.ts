import {
  CHATFILETYPE,
  ChatFileType,
} from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UploadResponse {
  filePath: string;
  imageUrl: string;
  fileId: string;
}

export enum FilePath {
  VIDEO = 'video/',
  AUDIO = 'audio/',
  IMAGE = 'images/',
  DOCUMENT = 'document/',
}

export enum FileType {
  VIDEO = 'video',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

export class VideoUploadResponse extends UploadResponse {
  thumbnailId: string;
  thumbnailPath: string;
  thumbnailImageUrl: string;
}

export class UploadChatAttachmentsDTO {
  @IsNotEmpty()
  @IsEnum(CHATFILETYPE)
  chatFileType: ChatFileType;
}
