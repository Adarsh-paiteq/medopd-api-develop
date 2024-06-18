import { Injectable } from '@nestjs/common';
import {
  NotificationContent,
  VideoCallNotificactionPayload,
} from './dto/notification-content.dto';

@Injectable()
export class NotificationsContent {
  bookingCreateNotification(clinicName: string): NotificationContent {
    const headings = 'New Booking Request!';
    const contents = `${clinicName} send you new booking!`;
    const data = {
      page: `/`,
    };
    return {
      headings,
      contents,
      data,
    };
  }

  videoCallNotification(
    payload: VideoCallNotificactionPayload,
  ): NotificationContent {
    const headings = '📞 Incoming Video Call!';
    const contents = `${payload.userName} wants to Connect with you.`;
    const data = {
      ...payload,
      page: `/`,
    };
    return {
      headings,
      contents,
      data,
    };
  }
}
