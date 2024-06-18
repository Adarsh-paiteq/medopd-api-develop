import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AudioCallsService } from './audio-calls.service';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { GetUser } from '@core/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import {
  StartAudioCallArgs,
  StartAudioCallResponse,
} from './dto/start-audio-call.dto';

@Resolver()
export class AudioCallsResolver {
  constructor(private readonly audioCallsService: AudioCallsService) {}

  @Mutation(() => StartAudioCallResponse, { name: 'startAudioCall' })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async startAudioCall(
    @GetUser() user: LoggedInUser,
    @Args() args: StartAudioCallArgs,
  ): Promise<StartAudioCallResponse> {
    return await this.audioCallsService.startAudioCall(user.id, args.chatId);
  }
}
