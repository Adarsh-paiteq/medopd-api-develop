import { EnvironmentVariable } from '@core/configs/env.config';
import {
  Call,
  EXOTEL_PROVIDER,
  Exotel,
  ExotelResponse,
} from '@core/providers/exotel.provider';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExotelService {
  constructor(
    @Inject(EXOTEL_PROVIDER) private readonly exotel: Exotel,
    private readonly configService: ConfigService,
  ) {}

  async startAudioCall(sender: string, receiver: string): Promise<Call> {
    const sidAccount = this.configService.getOrThrow<string>(
      EnvironmentVariable.EXOTEL_ACCOUNT_SID,
    );
    const callerId = this.configService.getOrThrow<string>(
      EnvironmentVariable.EXOTEL_CALLER_ID,
    );
    const payload = {
      From: sender,
      To: receiver,
      CallerId: callerId,
    };
    const path = `v1/Accounts/${sidAccount}/Calls/connect.json`;
    const {
      data: { Call },
    } = await this.exotel.post<ExotelResponse>(path, payload);
    return Call;
  }
}
