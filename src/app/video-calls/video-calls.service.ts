import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoCallsRepo } from './video-calls.repo';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '@core/configs/env.config';
import { AccessToken, TrackSource } from 'livekit-server-sdk';
import {
  InsertVideoCallDto,
  StartVideoCallResponse,
} from './dto/start-video-call.dto';
import { ulid } from 'ulid';
import { EventEmitter2 } from 'eventemitter2';
import { VideoCallStartedEvent, VideoCallsEvent } from './video-calls.event';

@Injectable()
export class VideoCallsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly videoCallsRepo: VideoCallsRepo,
    private readonly eventemitter: EventEmitter2,
  ) {}

  getLiveKitUserToken(roomId: string, participantName: string): string {
    const apiKey = this.configService.getOrThrow<string>(
      EnvironmentVariable.LIVEKIT_API_KEY,
    );
    const secretKey = this.configService.getOrThrow<string>(
      EnvironmentVariable.LIVEKIT_API_SECRET,
    );

    const accessToken = new AccessToken(apiKey, secretKey, {
      identity: participantName,
    });
    accessToken.addGrant({
      roomJoin: true,
      room: roomId,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: true,
      canPublishSources: [
        TrackSource.CAMERA,
        TrackSource.MICROPHONE,
        TrackSource.SCREEN_SHARE,
        TrackSource.SCREEN_SHARE_AUDIO,
      ],
    });
    const token = accessToken.toJwt();
    return token;
  }

  async startVideoCall(
    initiatorUserId: string,
    chatId: string,
  ): Promise<StartVideoCallResponse> {
    const chat = await this.videoCallsRepo.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat Not found`);
    }
    const { clinicId, bookingId, doctorId } = chat;

    const [doctor, clinic] = await Promise.all([
      this.videoCallsRepo.getDoctorById(initiatorUserId),
      this.videoCallsRepo.getClinicById(chat.clinicId),
    ]);

    if (!doctor?.fullName) {
      throw new NotFoundException(`Doctor Not found`);
    }

    if (!clinic) {
      throw new NotFoundException(`Clinic Not found`);
    }

    const roomId = ulid();
    const participantName = doctor.fullName.trim();
    const token = this.getLiveKitUserToken(roomId, participantName);

    this.eventemitter.emit(
      VideoCallsEvent.VIDEO_CALL_STARTED,
      new VideoCallStartedEvent(roomId, clinicId, doctorId),
    );

    const videoCallInput: InsertVideoCallDto = {
      doctorId: initiatorUserId,
      clinicId,
      bookingId,
      roomId,
    };
    await this.videoCallsRepo.createVideoCall(videoCallInput);
    return { token };
  }
}
