export type NotificationData = {
  page?: string;
};

export interface NotificationContent {
  headings: string;
  contents: string;
  data: NotificationData;
}

export enum NotificationSound {
  RINGTONE = 'ringtone.wav',
}

export class VideoCallNotificactionPayload {
  doctorId: string;
  clinicId: string;
  roomId: string;
  token: string;
  url: string;
  livekitBaseUrl: string;
  userName: string;
}
