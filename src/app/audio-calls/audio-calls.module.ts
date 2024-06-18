import { Module } from '@nestjs/common';
import { AudioCallsService } from './audio-calls.service';
import { AudioCallsResolver } from './audio-calls.resolver';
import { AudioCallsRepo } from './audio-calls.repo';

@Module({
  providers: [AudioCallsService, AudioCallsResolver, AudioCallsRepo],
  exports: [AudioCallsRepo],
})
export class AudioCallsModule {}
