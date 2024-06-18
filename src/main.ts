import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from '@core/services/auth.service';
import { ApiGuard } from '@core/guards/api.guard';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: '*' },
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  // api guard
  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);
  app.useGlobalGuards(new ApiGuard(reflector, authService));
  const port = 3000;
  await app.listen(port);
  logger.log(`Api running on port ${port}`);
}
bootstrap();
