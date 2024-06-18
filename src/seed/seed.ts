import { CommandFactory } from 'nest-commander';
import { SeedModule } from './seed.module';

async function bootstrap(): Promise<void> {
  await CommandFactory.run(SeedModule, ['error', 'debug', 'warn']);
}
bootstrap();
