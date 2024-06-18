import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import {
  CreateChatMessageInput,
  CreateChatMessageResponse,
} from './dto/create-chat-message.dto';
import { Roles } from '@core/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Role } from '@core/decorators/roles.decorator';
import { ChatMessagesService } from './chat-messages.service';
import {
  GetChatMessagesArgs,
  GetChatMessagesResponse,
} from './dto/get-chat-messages.dto';
import { GetChatArgs, GetChatResponse } from './dto/get-chat-message.dto';

@Resolver()
export class ChatMessagesResolver {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}
  @Mutation(() => CreateChatMessageResponse, {
    name: 'createChatMessage',
  })
  @Role(Roles.CLINIC, Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createChatMessage(
    @GetUser() user: LoggedInUser,
    @Args('input') input: CreateChatMessageInput,
  ): Promise<CreateChatMessageResponse> {
    return await this.chatMessagesService.createChatMessage(user.id, input);
  }

  @Query(() => GetChatMessagesResponse, {
    name: 'getChatMessages',
  })
  @Role(Roles.CLINIC, Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getChatMessages(
    @Args() args: GetChatMessagesArgs,
  ): Promise<GetChatMessagesResponse> {
    return await this.chatMessagesService.getChatMessages(args);
  }

  @Query(() => GetChatResponse, {
    name: 'getChatMessage',
  })
  @Role(Roles.CLINIC, Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getChatMessage(
    @GetUser() user: LoggedInUser,
    @Args() args: GetChatArgs,
  ): Promise<GetChatResponse> {
    return await this.chatMessagesService.getChatMessage(user.id, args);
  }
}
