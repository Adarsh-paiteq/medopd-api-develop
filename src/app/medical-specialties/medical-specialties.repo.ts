import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ulid } from 'ulid';
import {
  MedicalSpecialty,
  medicalSpecialtiesTable,
} from './medical-specialties.schema';
import { and, eq, ilike, sql } from 'drizzle-orm';

@Injectable()
export class MedicalSpecialtiesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      medicalSpecialtiesTable: typeof medicalSpecialtiesTable;
    }>,
  ) {}

  async BulkInsertSpecialties(
    specialties: string[],
  ): Promise<MedicalSpecialty[]> {
    const values = specialties.map<Pick<MedicalSpecialty, 'name' | 'id'>>(
      (specialty) => ({
        name: specialty.trim(),
        id: ulid(),
      }),
    );
    return await this.db
      .insert(medicalSpecialtiesTable)
      .values(values)
      .onConflictDoNothing({
        target: medicalSpecialtiesTable.name,
      })
      .returning();
  }

  async getSpecialties(name?: string): Promise<MedicalSpecialty[]> {
    const builder = this.db.select().from(medicalSpecialtiesTable);
    if (name) {
      builder.where(
        and(
          ilike(medicalSpecialtiesTable.name, sql.placeholder('name')),
          eq(medicalSpecialtiesTable.isDeleted, false),
        ),
      );
    } else {
      builder.where(eq(medicalSpecialtiesTable.isDeleted, false));
    }
    const query = builder.prepare('specialties');
    const executeOptions: Parameters<typeof query.execute>[0] = {};
    if (name) {
      executeOptions.name = `%${name}%`;
    }
    const result = await query.execute(executeOptions);
    return result;
  }

  async getSpecialtyById(
    specialtyId: string,
  ): Promise<MedicalSpecialty | undefined> {
    const [result] = await this.db
      .select()
      .from(medicalSpecialtiesTable)
      .where(
        and(
          eq(medicalSpecialtiesTable.id, specialtyId),
          eq(medicalSpecialtiesTable.isDeleted, false),
        ),
      );
    return result;
  }

  async getSpecailtyByName(
    name: string,
  ): Promise<MedicalSpecialty | undefined> {
    const formatName = name.replace(/ /g, '').toLowerCase();
    const [result] = await this.db
      .select()
      .from(medicalSpecialtiesTable)
      .where(
        and(
          eq(
            sql`LOWER(REPLACE(${medicalSpecialtiesTable.name},' ',''))`,
            formatName,
          ),
          eq(medicalSpecialtiesTable.isDeleted, false),
        ),
      );

    return result;
  }

  async updateSpecialty(
    id: string,
    name: string,
  ): Promise<MedicalSpecialty | undefined> {
    const [result] = await this.db
      .update(medicalSpecialtiesTable)
      .set({ name: name, updatedAt: new Date() })
      .where(eq(medicalSpecialtiesTable.id, id))
      .returning();
    return result;
  }

  async deleteSpecialty(id: string): Promise<MedicalSpecialty> {
    const [result] = await this.db
      .update(medicalSpecialtiesTable)
      .set({ isDeleted: true })
      .where(eq(medicalSpecialtiesTable.id, id))
      .returning();
    return result;
  }

  async addSpecialty(name: string): Promise<MedicalSpecialty> {
    const [result] = await this.db
      .insert(medicalSpecialtiesTable)
      .values({ id: ulid(), name: name })
      .onConflictDoUpdate({
        target: medicalSpecialtiesTable.name,
        set: { isDeleted: false, updatedAt: new Date(), createdAt: new Date() },
      })
      .returning();
    return result;
  }
}
