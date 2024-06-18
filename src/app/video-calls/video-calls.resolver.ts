import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VideoCallsService } from './video-calls.service';
import { Role } from '@core/decorators/roles.decorator';
import { GetUser } from '@core/decorators/user.decorator';
import { Roles } from '@core/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import {
  StartVideoCallArgs,
  StartVideoCallResponse,
} from './dto/start-video-call.dto';

@Resolver()
export class VideoCallsResolver {
  constructor(private readonly videoCallsService: VideoCallsService) {}

  @Mutation(() => StartVideoCallResponse, { name: 'startVideoCall' })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async startVideoCall(
    @GetUser() user: LoggedInUser,
    @Args() args: StartVideoCallArgs,
  ): Promise<StartVideoCallResponse> {
    return await this.videoCallsService.startVideoCall(user.id, args.chatId);
  }
}
