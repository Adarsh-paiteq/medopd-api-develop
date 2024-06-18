import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ulid } from 'ulid';
import { MedicalDegree, medicalDegreesTable } from './medical-degrees.schema';
import { ilike, sql, eq, and } from 'drizzle-orm';

@Injectable()
export class MedicalDegreesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      medicalDegreesTable: typeof medicalDegreesTable;
    }>,
  ) {}

  async BulkInsertDegrees(degrees: string[]): Promise<MedicalDegree[]> {
    const values = degrees.map<Pick<MedicalDegree, 'name' | 'id'>>(
      (degree) => ({
        name: degree.trim(),
        id: ulid(),
      }),
    );
    return await this.db
      .insert(medicalDegreesTable)
      .values(values)
      .onConflictDoNothing({
        target: medicalDegreesTable.name,
      })
      .returning();
  }

  async getDegreeByName(name: string): Promise<MedicalDegree | undefined> {
    const formatName = name.replace(/ /g, '').toLowerCase();
    const [result] = await this.db
      .select()
      .from(medicalDegreesTable)
      .where(
        and(
          eq(
            sql`LOWER(REPLACE(${medicalDegreesTable.name},' ',''))`,
            formatName,
          ),
          eq(medicalDegreesTable.isDeleted, false),
        ),
      );
    return result;
  }

  async addDegree(name: string): Promise<MedicalDegree> {
    const [result] = await this.db
      .insert(medicalDegreesTable)
      .values({ name: name, id: ulid() })
      .onConflictDoUpdate({
        target: medicalDegreesTable.name,
        set: { createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
      })
      .returning();
    return result;
  }

  async getDegrees(name?: string): Promise<MedicalDegree[]> {
    const builder = this.db.select().from(medicalDegreesTable);
    if (name) {
      builder.where(
        and(
          eq(medicalDegreesTable.isDeleted, false),
          ilike(medicalDegreesTable.name, sql.placeholder('name')),
        ),
      );
    } else {
      builder.where(eq(medicalDegreesTable.isDeleted, false));
    }
    const query = builder.prepare('degrees');
    const executeOptions: Parameters<typeof query.execute>[0] = {};
    if (name) {
      executeOptions.name = `%${name}%`;
    }
    const result = await query.execute(executeOptions);
    return result;
  }

  async getDegree(degreeId: string): Promise<MedicalDegree | undefined> {
    const [result] = await this.db
      .select()
      .from(medicalDegreesTable)
      .where(
        and(
          eq(medicalDegreesTable.id, degreeId),
          eq(medicalDegreesTable.isDeleted, false),
        ),
      );
    return result;
  }

  async deleteDegree(degreeId: string): Promise<MedicalDegree | undefined> {
    const [result] = await this.db
      .update(medicalDegreesTable)
      .set({ isDeleted: true })
      .where(eq(medicalDegreesTable.id, degreeId))
      .returning();
    return result;
  }

  async updateDegree(
    id: string,
    name: string,
  ): Promise<MedicalDegree | undefined> {
    const [result] = await this.db
      .update(medicalDegreesTable)
      .set({ name: name, updatedAt: new Date() })
      .where(eq(medicalDegreesTable.id, id))
      .returning();
    return result;
  }
}
