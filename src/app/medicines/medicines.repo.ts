import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Medicine, medicinesTable } from './medicines.schema';
import { ulid } from 'ulid';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class MedicinesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      medicinesTable: typeof medicinesTable;
    }>,
  ) {}

  async getMedicineByName(name: string): Promise<Medicine | undefined> {
    const formattedName = name.toLowerCase().replace(/\s+/g, '');
    const [result] = await this.db
      .select()
      .from(medicinesTable)
      .where(
        and(
          eq(medicinesTable.isDeleted, false),
          sql`LOWER(REPLACE(${medicinesTable.name}, ' ', '')) = ${formattedName}`,
        ),
      )
      .execute();
    return result;
  }

  async addMedicine(name: string, createdBy: string): Promise<Medicine> {
    const [result] = await this.db
      .insert(medicinesTable)
      .values({
        id: ulid(),
        name: name,
        createdBy: createdBy,
        updatedBy: createdBy,
      })
      .onConflictDoUpdate({
        target: medicinesTable.name,
        set: { updatedAt: new Date(), createdAt: new Date(), isDeleted: false },
      })
      .returning();
    return result;
  }
}
