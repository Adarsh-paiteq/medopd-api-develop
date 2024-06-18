import { Module } from '@nestjs/common';
import { VideoCallsService } from './video-calls.service';
import { VideoCallsResolver } from './video-calls.resolver';
import { VideoCallsRepo } from './video-calls.repo';

@Module({
  providers: [VideoCallsService, VideoCallsResolver, VideoCallsRepo],
  exports: [VideoCallsRepo, VideoCallsService],
})
export class VideoCallsModule {}
