import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  DoctorSpecialty,
  doctorSpecialtiesTable,
} from './doctor-specialties.schema';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';
import { medicalSpecialtiesTable } from '@medical-specialties/medical-specialties.schema';
import { DoctorSpecialtyNameOutput } from './dto/get-doctorSpecialtiesName.dto';

@Injectable()
export class DoctorSpecialtiesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      doctorSpecialtiesTable: typeof doctorSpecialtiesTable;
    }>,
  ) {}

  async getSpecialtyByDoctorId(doctorId: string): Promise<DoctorSpecialty[]> {
    const result = await this.db
      .select()
      .from(doctorSpecialtiesTable)
      .where(eq(doctorSpecialtiesTable.doctorId, doctorId));
    return result;
  }

  async addDoctorSpecialties(
    doctorId: string,
    specialtyId: string,
  ): Promise<DoctorSpecialty> {
    const [result] = await this.db
      .insert(doctorSpecialtiesTable)
      .values({
        id: ulid(),
        specialtyId: specialtyId,
        doctorId: doctorId,
      })
      .onConflictDoUpdate({
        target: [
          doctorSpecialtiesTable.doctorId,
          doctorSpecialtiesTable.specialtyId,
        ],
        set: {
          doctorId: doctorId,
          specialtyId: specialtyId,
        },
      })
      .returning();
    return result;
  }

  async getDoctorspecialtiesName(
    doctorId: string,
  ): Promise<DoctorSpecialtyNameOutput[]> {
    const specialties = await this.db
      .select({
        specialtyName: medicalSpecialtiesTable.name,
      })
      .from(doctorSpecialtiesTable)
      .innerJoin(
        medicalSpecialtiesTable,
        eq(medicalSpecialtiesTable.id, doctorSpecialtiesTable.specialtyId),
      )
      .where(eq(doctorSpecialtiesTable.doctorId, doctorId));
    return specialties;
  }
}
