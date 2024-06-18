import { Environment, EnvironmentVariable } from '@core/configs/env.config';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { GlobalLogConfig } from 'axios-logger/lib/common/types';
import * as AxiosLogger from 'axios-logger';

export const EXOTEL_PROVIDER = 'EXOTEL_PROVIDER';
export type Exotel = AxiosInstance;
export interface Call {
  Sid: string;
  ParentCallSid: string | null;
  DateCreated: string;
  DateUpdated: string;
  AccountSid: string;
  To: string;
  From: string;
  PhoneNumberSid: string;
  Status: string;
  StartTime: string;
  EndTime: string | null;
  Duration: string | null;
  Price: string | null;
  Direction: string;
  AnsweredBy: string | null;
  ForwardedFrom: string | null;
  CallerName: string | null;
  Uri: string;
  RecordingUrl: string | null;
}
export interface ExotelResponse {
  Call: Call;
}

export const ExotelProvider: FactoryProvider<AxiosInstance> = {
  provide: EXOTEL_PROVIDER,
  inject: [ConfigService],
  useFactory(configService: ConfigService): AxiosInstance {
    const logger = new Logger('EXOTEL_PROVIDER');
    const username = configService.getOrThrow<string>(
      EnvironmentVariable.EXOTEL_USER_NAME,
    );
    const password = configService.getOrThrow<string>(
      EnvironmentVariable.EXOTEL_PASSWORD,
    );
    const subDomain = configService.getOrThrow<string>(
      EnvironmentVariable.EXOTEL_SUB_DOMAIN,
    );
    const nodeEnv = configService.getOrThrow<Environment>(
      EnvironmentVariable.NODE_ENV,
    );
    const isLocal = nodeEnv === Environment.Local;
    const api = Axios.create({
      baseURL: `https://${subDomain}`,
      auth: {
        username: username,
        password: password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // axios logger config
    const logConfig: GlobalLogConfig = {
      headers: false,
      data: isLocal,
      prefixText: `${EXOTEL_PROVIDER}`,
      logger: logger.log.bind(logger),
    };
    // https://github.com/hg-pyun/axios-logger/issues/124#issuecomment-1454993672
    api.interceptors.request.use(
      (internalrequest: InternalAxiosRequestConfig) => {
        const headers = internalrequest.headers;
        const request: InternalAxiosRequestConfig = {
          ...internalrequest,
        };
        const logrequest = AxiosLogger.requestLogger(request, logConfig);
        internalrequest = {
          ...logrequest,
          ...{ headers: headers },
        };
        return internalrequest;
      },
      (error) => {
        return AxiosLogger.errorLogger(error, logConfig);
      },
    );
    api.interceptors.response.use(
      (response) => {
        return AxiosLogger.responseLogger(response, logConfig);
      },
      (error) => {
        return AxiosLogger.errorLogger(error, logConfig);
      },
    );
    return api;
  },
};
