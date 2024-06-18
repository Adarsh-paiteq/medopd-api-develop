import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsRepo } from './notifications.repo';
import { NotificationsEventListener } from './notifications.listener';
import { NotificationsContent } from './notifications.content';
import { VideoCallsModule } from '@video-calls/video-calls.module';

@Module({
  imports: [VideoCallsModule],
  providers: [
    NotificationsService,
    NotificationsResolver,
    NotificationsRepo,
    NotificationsEventListener,
    NotificationsContent,
  ],
  exports: [NotificationsRepo],
})
export class NotificationsModule {}
