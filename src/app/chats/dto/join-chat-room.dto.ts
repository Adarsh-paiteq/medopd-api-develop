import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChatRoomBody {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}
