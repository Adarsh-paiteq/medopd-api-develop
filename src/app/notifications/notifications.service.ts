import { Injectable } from '@nestjs/common';
import { NotificationsRepo } from './notifications.repo';
import { OneSignalService } from '@core/services/one-signal.service';
import { Booking } from '@bookings/bookings.schema';
import { NotificationsContent } from './notifications.content';
import { SaveUserNotificationDto } from './dto/create-notification.dto';
import { VideoCallStartedEvent } from '@video-calls/video-calls.event';
import { VideoCallNotificactionPayload } from './dto/notification-content.dto';
import { VideoCallsService } from '@video-calls/video-calls.service';
import { PaginationArgs } from '@utils/helpers';
import { GetNotificationsOutput } from './dto/get-doctor-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepo: NotificationsRepo,
    private readonly oneSignalService: OneSignalService,
    private readonly notificationContent: NotificationsContent,
    private readonly videoCallsService: VideoCallsService,
  ) {}

  async sendBookingNotification(payload: Booking): Promise<string> {
    const { clinicId, doctorId } = payload;
    const clinic = await this.notificationsRepo.getClinicById(clinicId);
    if (!clinic?.clinicName) {
      return `Clinic Not Found with ID: ${clinicId}`;
    }
    const { data, contents, headings } =
      this.notificationContent.bookingCreateNotification(clinic.clinicName);

    const saveUserNotification: SaveUserNotificationDto = {
      receiverId: doctorId,
      title: headings,
      body: contents,
      page: data.page,
      senderId: clinicId,
    };
    await this.notificationsRepo.saveUserNotification(saveUserNotification);

    const notification = this.oneSignalService.prepareDoctorNotification(
      data,
      contents,
      headings,
    );
    const result =
      await this.oneSignalService.sendDoctorPushNotificationToExternalUserIds(
        notification,
        [doctorId],
      );
    if (!result.id) {
      return `Failed to Send Notification. ${JSON.stringify(result.errors)} `;
    }
    return `Booking Created Notification Sent ${JSON.stringify(result)}`;
  }

  async sendVideoCallNotification(
    payload: VideoCallStartedEvent,
  ): Promise<string> {
    const { clinicId, doctorId, roomId } = payload;

    const [clinic, doctor] = await Promise.all([
      this.notificationsRepo.getClinicById(clinicId),
      this.notificationsRepo.getDoctorById(doctorId),
    ]);

    if (!clinic?.clinicName) {
      return `Clinic Not Found with ID: ${clinicId}`;
    }
    if (!doctor?.fullName) {
      return `Doctor Not Found with ID: ${doctorId}`;
    }

    const participantName = clinic.clinicName.trim();
    const token = this.videoCallsService.getLiveKitUserToken(
      roomId,
      participantName,
    );
    const livekitBaseUrl = `https://livekit.dev.medopd.com`;
    const url = `${livekitBaseUrl}/?token=${token}`;

    const notificationPayload: VideoCallNotificactionPayload = {
      doctorId,
      clinicId,
      roomId,
      token,
      livekitBaseUrl,
      url,
      userName: doctor.fullName,
    };
    const { data, contents, headings } =
      this.notificationContent.videoCallNotification(notificationPayload);

    // const saveUserNotification: SaveUserNotificationDto = {
    //   receiverId: clinicId,
    //   title: headings,
    //   body: contents,
    //   page: data.page,
    //   senderId: doctorId,
    // };
    // await this.notificationsRepo.saveUserNotification(saveUserNotification);
    const notification = this.oneSignalService.prepareClinicNotification(
      data,
      contents,
      headings,
    );
    const result =
      await this.oneSignalService.sendClinicPushNotificationToExternalUserIds(
        notification,
        [clinicId],
      );

    if (!result.id) {
      return `Failed to Send Video Call Notification. ${JSON.stringify(
        result,
      )} `;
    }

    return `Video Call Notification Sent. ${JSON.stringify(result)}`;
  }

  async getDoctorNotifications(
    receiverId: string,
    args: PaginationArgs,
  ): Promise<GetNotificationsOutput> {
    const { page, limit } = args;
    const { notifications, total } =
      await this.notificationsRepo.getNotificationsByReceiverId(
        receiverId,
        page,
        limit,
      );
    const hasMore = total > page * limit;
    return {
      notifications,
      hasMore,
    };
  }
}
