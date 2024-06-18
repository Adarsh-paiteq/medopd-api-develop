import { NestFactory } from '@nestjs/core';
import { MigrationsModule } from './migrate.module';
import { MigrationsService } from './migrate.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(MigrationsModule);
  const service = app.get(MigrationsService);
  await service.start();
  await app.close();
}
bootstrap();
