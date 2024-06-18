import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { BookingCreateEvent, BookingEvent } from '@bookings/booking.event';
import {
  VideoCallStartedEvent,
  VideoCallsEvent,
} from '@video-calls/video-calls.event';

@Injectable()
export class NotificationsEventListener {
  private readonly logger = new Logger(NotificationsEventListener.name);
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(BookingEvent.BOOKING_CREATED)
  async handleBookingCreatedNotificationEvent(
    payload: BookingCreateEvent,
  ): Promise<void> {
    const { booking } = payload;
    await this.notificationsService.sendBookingNotification(booking);
  }

  @OnEvent(VideoCallsEvent.VIDEO_CALL_STARTED)
  async handleVideoCallStartedEvent(
    payload: VideoCallStartedEvent,
  ): Promise<void> {
    await this.notificationsService.sendVideoCallNotification(payload);
  }
}
