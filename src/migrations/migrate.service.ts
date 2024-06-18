import { Inject, Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { MIGRATE_PROVIDER } from './migrate.provider';

@Injectable()
export class MigrationsService {
  constructor(
    @Inject(MIGRATE_PROVIDER) private readonly connection: postgres.Sql,
  ) {}
  async start(): Promise<void> {
    await migrate(drizzle(this.connection), {
      migrationsFolder: './dist/migrations/sql',
    });
    this.connection.end();
  }
}
