import { Module, forwardRef } from '@nestjs/common';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsRepo } from './prescriptions.repo';
import { BookingsModule } from '@bookings/bookings.module';
import { CoreModule } from '@core/core.module';
import { ChatMessageAttachmentsModule } from '@chat-message-attachments/chat-message-attachments.module';
import { ChatMessagesModule } from '@chat-messages/chat-messages.module';

@Module({
  imports: [
    forwardRef(() => BookingsModule),
    CoreModule,
    ChatMessagesModule,
    ChatMessageAttachmentsModule,
  ],
  providers: [PrescriptionsResolver, PrescriptionsService, PrescriptionsRepo],
  exports: [PrescriptionsRepo],
})
export class PrescriptionsModule {}
