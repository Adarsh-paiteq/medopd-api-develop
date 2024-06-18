import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { EnvironmentVariable } from '../configs/env.config';

export type DatabaseConnection = postgres.Sql;

export const DATABASE_PROVIDER = 'DATABASE_PROVIDER';
export const DatabaseProvider: FactoryProvider<ReturnType<typeof postgres>> = {
  provide: DATABASE_PROVIDER,
  inject: [ConfigService],
  useFactory(configService: ConfigService) {
    const dbUrl = configService.getOrThrow<string>(
      EnvironmentVariable.POSTGRES_URL,
    );
    const client = postgres(dbUrl);
    return client;
  },
};
