import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Patient, patientsTable } from './patients.schema';
import { ulid } from 'ulid';
import { AddPatientInput } from './dto/add-patient.dto';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class PatientsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      patientsTable: typeof patientsTable;
    }>,
  ) {}

  async addPatient(patient: AddPatientInput): Promise<Patient> {
    const { mobileNumber, fullName, gender, patientAge } = patient;
    const [result] = await this.db
      .insert(patientsTable)
      .values({
        fullName: fullName,
        mobileNumber: mobileNumber,
        id: ulid(),
        gender: gender,
        patientAge: patientAge,
      })
      .returning();
    return result;
  }

  async getPatientByMobileNumberAndName(
    mobileNumber: string,
    fullName: string,
  ): Promise<Patient | undefined> {
    const [result] = await this.db
      .select()
      .from(patientsTable)
      .where(
        and(
          eq(patientsTable.mobileNumber, mobileNumber),
          eq(patientsTable.fullName, fullName),
        ),
      );
    return result;
  }

  async getPatientById(patientId: string): Promise<Patient | undefined> {
    const [result] = await this.db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, patientId));
    return result;
  }
}
