import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerModuleOptions } from './configs/logger.config';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/env.config';
import { DatabaseProvider } from './providers/database.provider';
import { DrizzleProvider } from './providers/drizzle.provider';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlModuleOptions } from './configs/graphql.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import jwtOptions from './configs/jwt.config';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './configs/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception-filters/all.exception-filter';
import { StorageService } from './services/storage.service';
import { MSG91Provider } from './providers/msg91.provider';
import { SMSService } from './services/sms.service';
import { HtmlToImageService } from './services/htmlToImage.service';
import { TemplateService } from './services/template.service';
import { ExotelService } from './services/exotel.service';
import { ExotelProvider } from './providers/exotel.provider';
import { OneSignalService } from './services/one-signal.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    LoggerModule.forRoot(loggerModuleOptions),
    GraphQLModule.forRootAsync(graphqlModuleOptions),
    PassportModule,
    JwtModule.registerAsync(jwtOptions),
  ],
  providers: [
    DatabaseProvider,
    DrizzleProvider,
    AuthService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    StorageService,
    MSG91Provider,
    SMSService,
    HtmlToImageService,
    TemplateService,
    ExotelProvider,
    ExotelService,
    OneSignalService,
  ],
  exports: [
    DrizzleProvider,
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtModule,
    StorageService,
    SMSService,
    HtmlToImageService,
    ExotelService,
    OneSignalService,
  ],
})
export class CoreModule {}
