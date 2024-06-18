import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@core/configs/env.config';
import { MigrationsService } from './migrate.service';
import { MigrateProvider } from './migrate.provider';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  providers: [MigrateProvider, MigrationsService],
})
export class MigrationsModule {}
