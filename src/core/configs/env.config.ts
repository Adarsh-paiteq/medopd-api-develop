import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Local = 'local',
}

export enum EnvironmentVariable {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  POSTGRES_URL = 'POSTGRES_URL',
  JWT_SECRET = 'JWT_SECRET',
  TEST_CLINIC_MOBILE_NUMBER = 'TEST_CLINIC_MOBILE_NUMBER',
  TEST_CLINIC_MOBILE_NUMBER_OTP = 'TEST_CLINIC_MOBILE_NUMBER_OTP',
  TEST_DOCTOR_MOBILE_NUMBER = 'TEST_DOCTOR_MOBILE_NUMBER',
  TEST_DOCTOR_MOBILE_NUMBER_OTP = 'TEST_DOCTOR_MOBILE_NUMBER_OTP',
  API_TOKEN = 'API_TOKEN',
  AWS_ACCESS_KEY = 'AWS_ACCESS_KEY',
  AWS_SECRET = 'AWS_SECRET',
  AWS_REGION = 'AWS_REGION',
  AWS_S3_BUCKET = 'AWS_S3_BUCKET',
  IMAGEKIT_BASE_URL = 'IMAGEKIT_BASE_URL',
  WEB_SOCKET_PORT = 'WEB_SOCKET_PORT',
  MSG91_AUTH_KEY = 'MSG91_AUTH_KEY',
  MSG91_OTP_TE_ID = 'MSG91_OTP_TE_ID',
  MSG91_SMS_HASH = 'MSG91_SMS_HASH',
  EXOTEL_USER_NAME = 'EXOTEL_USER_NAME',
  EXOTEL_PASSWORD = 'EXOTEL_PASSWORD',
  EXOTEL_ACCOUNT_SID = 'EXOTEL_ACCOUNT_SID',
  EXOTEL_SUB_DOMAIN = 'EXOTEL_SUB_DOMAIN',
  EXOTEL_CALLER_ID = 'EXOTEL_CALLER_ID',
  LIVEKIT_API_KEY = 'LIVEKIT_API_KEY',
  LIVEKIT_API_SECRET = 'LIVEKIT_API_SECRET',
  ONESIGNAL_DOCTOR_APP_ID = 'ONESIGNAL_DOCTOR_APP_ID',
  ONESIGNAL_DOCTOR_APP_KEY = 'ONESIGNAL_DOCTOR_APP_KEY',
  ONESIGNAL_CLINIC_APP_ID = 'ONESIGNAL_CLINIC_APP_ID',
  ONESIGNAL_CLINIC_APP_KEY = 'ONESIGNAL_CLINIC_APP_KEY',
  ONESIGNAL_ANDROID__NOTIFICATION_CHANNELS = 'ONESIGNAL_ANDROID__NOTIFICATION_CHANNELS',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  POSTGRES_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  TEST_CLINIC_MOBILE_NUMBER: string;

  @IsNotEmpty()
  @IsString()
  TEST_CLINIC_MOBILE_NUMBER_OTP: string;

  @IsNotEmpty()
  @IsString()
  TEST_DOCTOR_MOBILE_NUMBER: string;

  @IsNotEmpty()
  @IsString()
  TEST_DOCTOR_MOBILE_NUMBER_OTP: string;

  @IsNotEmpty()
  @IsString()
  API_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  AWS_ACCESS_KEY: string;

  @IsNotEmpty()
  @IsString()
  AWS_SECRET: string;

  @IsNotEmpty()
  @IsString()
  AWS_REGION: string;

  @IsNotEmpty()
  @IsString()
  AWS_S3_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  IMAGEKIT_BASE_URL: string;

  @IsNumber()
  @IsNotEmpty()
  WEB_SOCKET_PORT: number;

  @IsNotEmpty()
  @IsString()
  MSG91_AUTH_KEY: string;

  @IsNotEmpty()
  @IsString()
  MSG91_OTP_TE_ID: string;

  @IsNotEmpty()
  @IsString()
  MSG91_SMS_HASH: string;

  @IsNotEmpty()
  @IsString()
  EXOTEL_USER_NAME: string;

  @IsNotEmpty()
  @IsString()
  EXOTEL_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  EXOTEL_ACCOUNT_SID: string;

  @IsNotEmpty()
  @IsString()
  EXOTEL_SUB_DOMAIN: string;

  @IsNotEmpty()
  @IsString()
  EXOTEL_CALLER_ID: string;

  @IsNotEmpty()
  @IsString()
  LIVEKIT_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  LIVEKIT_API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  ONESIGNAL_DOCTOR_APP_ID: string;

  @IsNotEmpty()
  @IsString()
  ONESIGNAL_DOCTOR_APP_KEY: string;

  @IsNotEmpty()
  @IsString()
  ONESIGNAL_CLINIC_APP_ID: string;

  @IsNotEmpty()
  @IsString()
  ONESIGNAL_CLINIC_APP_KEY: string;

  @IsOptional()
  @IsString()
  ONESIGNAL_ANDROID__NOTIFICATION_CHANNELS: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  validate,
};
