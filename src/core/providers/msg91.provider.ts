import { Environment, EnvironmentVariable } from '@core/configs/env.config';
import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { GlobalLogConfig } from 'axios-logger/lib/common/types';
import * as AxiosLogger from 'axios-logger';

export const MSG91 = 'MSG91';
export type MSG91 = AxiosInstance;
export interface MSG91_Response {
  type: 'error' | 'success';
  message?: string;
}

export const MSG91Provider: FactoryProvider<AxiosInstance> = {
  provide: MSG91,
  inject: [ConfigService],
  useFactory(configService: ConfigService): AxiosInstance {
    const logger = new Logger('MSG91');
    const authkey = configService.getOrThrow<string>(
      EnvironmentVariable.MSG91_AUTH_KEY,
    );
    const nodeEnv = configService.getOrThrow<Environment>(
      EnvironmentVariable.NODE_ENV,
    );
    const isLocal = nodeEnv === Environment.Local;
    const api = Axios.create({
      baseURL: 'https://control.msg91.com',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authkey,
      },
    });

    // axios logger config
    const logConfig: GlobalLogConfig = {
      headers: false,
      data: isLocal,
      prefixText: `${MSG91}`,
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
