import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ulid } from 'ulid';
import { and, eq, ilike, sql } from 'drizzle-orm';
import {
  MedicalCouncil,
  medicalCouncilsTable,
} from './medical-councils.schema';

@Injectable()
export class MedicalCouncilsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      medicalCouncilsTable: typeof medicalCouncilsTable;
    }>,
  ) {}

  async BulkInsertCouncil(councils: string[]): Promise<MedicalCouncil[]> {
    const values = councils.map<Pick<MedicalCouncil, 'name' | 'id'>>(
      (council) => ({
        name: council.trim(),
        id: ulid(),
      }),
    );
    return await this.db
      .insert(medicalCouncilsTable)
      .values(values)
      .onConflictDoNothing({
        target: medicalCouncilsTable.name,
      })
      .returning();
  }

  async getCouncils(name?: string): Promise<MedicalCouncil[]> {
    const builder = this.db.select().from(medicalCouncilsTable);
    if (name) {
      builder.where(
        and(
          eq(medicalCouncilsTable.isDeleted, false),
          ilike(medicalCouncilsTable.name, sql.placeholder('name')),
        ),
      );
    } else {
      builder.where(eq(medicalCouncilsTable.isDeleted, false));
    }
    const query = builder.prepare('councils');
    const executeOptions: Parameters<typeof query.execute>[0] = {};
    if (name) {
      executeOptions.name = `%${name}%`;
    }
    const result = await query.execute(executeOptions);
    return result;
  }

  async updateMedicalCouncil(
    councilId: string,
    name: string,
  ): Promise<MedicalCouncil | undefined> {
    const [result] = await this.db
      .update(medicalCouncilsTable)
      .set({ name: name, updatedAt: new Date() })
      .where(eq(medicalCouncilsTable.id, councilId))
      .returning();
    return result;
  }

  async addMedicalCouncil(name: string): Promise<MedicalCouncil> {
    const [result] = await this.db
      .insert(medicalCouncilsTable)
      .values({ name: name, id: ulid() })
      .onConflictDoUpdate({
        target: medicalCouncilsTable.name,
        set: { updatedAt: new Date(), createdAt: new Date(), isDeleted: false },
      })
      .returning();
    return result;
  }

  async getCouncilByName(name: string): Promise<MedicalCouncil | undefined> {
    const formattedName = name.toLowerCase().replace(/\s+/g, '');
    const [result] = await this.db
      .select()
      .from(medicalCouncilsTable)
      .where(
        and(
          eq(medicalCouncilsTable.isDeleted, false),
          sql`LOWER(REPLACE(${medicalCouncilsTable.name}, ' ', '')) = ${formattedName}`,
        ),
      );
    return result;
  }

  async getMedicalCouncilById(id: string): Promise<MedicalCouncil | undefined> {
    const [result] = await this.db
      .select()
      .from(medicalCouncilsTable)
      .where(
        and(
          eq(medicalCouncilsTable.id, id),
          eq(medicalCouncilsTable.isDeleted, false),
        ),
      );
    return result;
  }

  async deleteMedicalCouncil(
    councilId: string,
  ): Promise<MedicalCouncil | undefined> {
    const [result] = await this.db
      .update(medicalCouncilsTable)
      .set({ isDeleted: true })
      .where(eq(medicalCouncilsTable.id, councilId))
      .returning();
    return result;
  }
}
