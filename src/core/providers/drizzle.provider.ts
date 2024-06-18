import { FactoryProvider } from '@nestjs/common';
import { DATABASE_PROVIDER, DatabaseConnection } from './database.provider';
import { drizzle } from 'drizzle-orm/postgres-js';
export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export const DrizzleProvider: FactoryProvider<ReturnType<typeof drizzle>> = {
  provide: DRIZZLE_PROVIDER,
  inject: [DATABASE_PROVIDER],
  useFactory(client: DatabaseConnection) {
    const db = drizzle(client);
    return db;
  },
};
