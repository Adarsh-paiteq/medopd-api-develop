import { EnvironmentVariable } from '@core/configs/env.config';
import { MSG91, MSG91_Response } from '@core/providers/msg91.provider';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SMSService {
  constructor(
    @Inject(MSG91) private readonly msg91: MSG91,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @param mobile
   * @example mobile=91123456789
   */
  async sendOTP(mobile: string, params = {}): Promise<MSG91_Response> {
    const templateId = this.configService.getOrThrow<string>(
      EnvironmentVariable.MSG91_OTP_TE_ID,
    );
    const hash = this.configService.getOrThrow<string>(
      EnvironmentVariable.MSG91_SMS_HASH,
    );
    const path = `api/v5/otp?template_id=${templateId}&mobile=${mobile}`;
    const { data } = await this.msg91.post<MSG91_Response>(path, {
      ...params,
      SMSHASH: hash,
    });
    return data;
  }

  /**
   *
   *
   * @param {string} OTP
   * @param {string} mobile
   * @return {*}  {Promise<MSG91_Response>}
   * @memberof SMSService
   */
  async verifyOTP(OTP: string, mobile: string): Promise<MSG91_Response> {
    const path = `/api/v5/otp/verify?otp=${OTP}&mobile=${mobile}`;
    const { data } = await this.msg91.get<MSG91_Response>(path);
    return data;
  }

  /**
   * @param mobile
   * @example mobile=91123456789
   * @description resend otp if there's existing otp request, Max OTP retry count is 2
   */
  async resendOTP(mobile: string): Promise<MSG91_Response> {
    const path = `api/v5/otp/retry?retrytype=text&mobile=${mobile}`;
    const { data } = await this.msg91.get<MSG91_Response>(path);
    return data;
  }
}
