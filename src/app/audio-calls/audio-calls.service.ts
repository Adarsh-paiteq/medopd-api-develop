import { Injectable, NotFoundException } from '@nestjs/common';
import { AudioCallsRepo } from './audio-calls.repo';
import {
  InsertAudioCallDto,
  StartAudioCallResponse,
} from './dto/start-audio-call.dto';
import { ExotelService } from '@core/services/exotel.service';

@Injectable()
export class AudioCallsService {
  constructor(
    private readonly audioCallsRepo: AudioCallsRepo,
    private readonly exotelService: ExotelService,
  ) {}

  async startAudioCall(
    userId: string,
    chatId: string,
  ): Promise<StartAudioCallResponse> {
    const chat = await this.audioCallsRepo.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat Not found`);
    }
    const { clinicId, bookingId } = chat;

    const [doctor, clinic] = await Promise.all([
      this.audioCallsRepo.getDoctorById(userId),
      this.audioCallsRepo.getClinicById(clinicId),
    ]);

    if (!doctor) {
      throw new NotFoundException(`Doctor Not found`);
    }
    const { mobileNumber: doctorMobileNumber } = doctor;

    if (!clinic) {
      throw new NotFoundException(`Clinic Not found`);
    }
    const { mobileNumber: clinicMobileNumber } = clinic;

    const { Sid } = await this.exotelService.startAudioCall(
      doctorMobileNumber,
      clinicMobileNumber,
    );
    const audioCallInput: InsertAudioCallDto = {
      sid: Sid,
      doctorId: userId,
      clinicId,
      bookingId,
    };
    await this.audioCallsRepo.createAudioCall(audioCallInput);
    return { message: 'Audio call started' };
  }
}
