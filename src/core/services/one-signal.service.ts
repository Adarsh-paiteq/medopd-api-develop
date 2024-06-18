import { EnvironmentVariable } from '@core/configs/env.config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OneSignal from '@onesignal/node-onesignal';
import { v4 as uuidv4 } from 'uuid';

export enum OneSignalSegments {
  SUBSCRIBED_USERS = 'Subscribed Users',
  INACTIVE_USERS = 'Inactive Users',
}

export enum ChannelForExternalIds {
  PUSH = 'push',
}

export interface NotificationChannels {
  development: NotificationChannel[];
  staging: NotificationChannel[];
  production: NotificationChannel[];
}

export interface NotificationChannel {
  id: string;
  reminderTone: string;
}

@Injectable()
export class OneSignalService {
  private doctorClient: OneSignal.DefaultApi;
  private doctorAppId: string;
  private clinicClient: OneSignal.DefaultApi;
  private clinicAppId: string;
  private readonly logger = new Logger(OneSignalService.name);

  constructor(private readonly configService: ConfigService) {
    this.configure();
  }

  private getConfiguration(appKey: string): OneSignal.Configuration {
    const app_key_provider = {
      getToken(): string {
        return appKey;
      },
    };
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: app_key_provider,
        },
      },
    });
    return configuration;
  }

  private configure(): void {
    const doctorAppKey = this.configService.get(
      EnvironmentVariable.ONESIGNAL_DOCTOR_APP_KEY,
    );
    const doctorAppId = this.configService.get(
      EnvironmentVariable.ONESIGNAL_DOCTOR_APP_ID,
    );
    this.doctorClient = new OneSignal.DefaultApi(
      this.getConfiguration(doctorAppKey),
    );
    this.doctorAppId = doctorAppId;

    const clinicAppKey = this.configService.get(
      EnvironmentVariable.ONESIGNAL_CLINIC_APP_KEY,
    );
    const clinicAppId = this.configService.get(
      EnvironmentVariable.ONESIGNAL_CLINIC_APP_ID,
    );
    this.clinicClient = new OneSignal.DefaultApi(
      this.getConfiguration(clinicAppKey),
    );
    this.clinicAppId = clinicAppId;
  }

  prepareDoctorNotification(
    data: object,
    content: string,
    heading: string,
    reminderSound?: string,
  ): OneSignal.Notification {
    const notification = new OneSignal.Notification();
    notification.app_id = this.doctorAppId;
    notification.data = { ...data, notificationId: uuidv4() };
    notification.priority = 10;
    notification.contents = {
      en: content,
    };

    // required for Huawei
    notification.headings = {
      en: heading,
    };
    if (reminderSound) {
      notification.ios_sound = reminderSound;
      const androidChannelId =
        this.getAndroidNotificationChannel(reminderSound);
      if (!androidChannelId) {
        return notification;
      }
      const [reminderSoundAndroid] = reminderSound.split('.');
      notification.android_channel_id = androidChannelId;
      notification.android_sound = reminderSoundAndroid;
    }
    return notification;
  }

  prepareClinicNotification(
    data: object,
    content: string,
    heading: string,
    reminderSound?: string,
  ): OneSignal.Notification {
    const notification = new OneSignal.Notification();
    notification.app_id = this.clinicAppId;
    notification.data = { ...data, notificationId: uuidv4() };
    notification.priority = 10;
    notification.contents = {
      en: content,
    };

    // required for Huawei
    notification.headings = {
      en: heading,
    };
    if (reminderSound) {
      notification.ios_sound = reminderSound;
      const androidChannelId =
        this.getAndroidNotificationChannel(reminderSound);
      if (!androidChannelId) {
        return notification;
      }
      const [reminderSoundAndroid] = reminderSound.split('.');
      notification.android_channel_id = androidChannelId;
      notification.android_sound = reminderSoundAndroid;
    }
    return notification;
  }

  async sendDoctorNotification(
    notification: OneSignal.Notification,
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    return await this.doctorClient.createNotification(notification);
  }

  async sendDoctorPushNotificationToExternalUserIds(
    notification: OneSignal.Notification,
    externalUserIds: string[],
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    return await this.sendDoctorNotification({
      ...notification,
      include_external_user_ids: externalUserIds,
      channel_for_external_user_ids: ChannelForExternalIds.PUSH,
    });
  }

  async sendClinicNotification(
    notification: OneSignal.Notification,
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    return await this.clinicClient.createNotification(notification);
  }

  async sendClinicPushNotificationToExternalUserIds(
    notification: OneSignal.Notification,
    externalUserIds: string[],
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    return await this.sendClinicNotification({
      ...notification,
      include_external_user_ids: externalUserIds,
      channel_for_external_user_ids: ChannelForExternalIds.PUSH,
    });
  }

  /**
   * @reference https://documentation.onesignal.com/docs/data-notifications#backgrounddata-notifications-with-the-rest-api
   */
  prepareBackgroupNotification(data: object): OneSignal.Notification {
    const notification = new OneSignal.Notification();
    notification.app_id = this.doctorAppId;
    notification.data = { ...data, notificationId: uuidv4() };
    notification.content_available = true;
    notification.apns_push_type_override = 'voip';
    return notification;
  }

  getAndroidNotificationChannel(reminderTone: string): string {
    const channelsEncodedString = this.configService.getOrThrow(
      EnvironmentVariable.ONESIGNAL_ANDROID__NOTIFICATION_CHANNELS,
    );
    const channelsDecodedString = Buffer.from(
      channelsEncodedString,
      'base64',
    ).toString();
    const channels: NotificationChannels = JSON.parse(channelsDecodedString);
    const nodeenv = this.configService.getOrThrow<string>(
      EnvironmentVariable.NODE_ENV,
    );
    const envAndroidChannels = channels[
      nodeenv as keyof NotificationChannels
    ] as NotificationChannel[];
    if (!envAndroidChannels) {
      this.logger.warn(
        `Android notification channels not configured for this ${nodeenv}`,
      );
      return '';
    }
    const channel = envAndroidChannels.find(
      (channel) => channel.reminderTone === reminderTone,
    );
    if (!channel) {
      this.logger.warn(`No channel found for ${reminderTone}`);
      return '';
    }
    return channel.id;
  }
}
