import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { GetChatList, GetChatListArgs } from './dto/get-chat-list.dto';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { Roles } from '@core/services/auth.service';
import { Role } from '@core/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';

@Resolver()
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Query(() => GetChatList, { name: 'getChatList' })
  @Role(Roles.CLINIC, Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getChatList(
    @GetUser() user: LoggedInUser,
    @Args() args: GetChatListArgs,
  ): Promise<GetChatList> {
    return await this.chatsService.getChatList(user.id, args);
  }
}
