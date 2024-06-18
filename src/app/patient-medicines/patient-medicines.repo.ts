import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  PatientMedicine,
  patientMedicinesTable,
} from './patient-medicines.schema';
import { AddPatientMedicineInput } from './dto/add-patient-medicine.dto';
import { ulid } from 'ulid';
import { and, eq } from 'drizzle-orm';
import { UpdatePatientMedicineInput } from './dto/update-patient-medicine.dto';

@Injectable()
export class PatientMedicinesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      patientMedicinesTable: typeof patientMedicinesTable;
    }>,
  ) {}

  async addPatientMedicine(
    doctorId: string,
    bookingId: string,
    input: AddPatientMedicineInput,
  ): Promise<PatientMedicine> {
    const [result] = await this.db
      .insert(patientMedicinesTable)
      .values({
        id: ulid(),
        doctorId: doctorId,
        bookingId: bookingId,
        ...input,
      })
      .returning();
    return result;
  }

  async getPatientMedicineById(
    id: string,
  ): Promise<PatientMedicine | undefined> {
    const [result] = await this.db
      .select()
      .from(patientMedicinesTable)
      .where(
        and(
          eq(patientMedicinesTable.id, id),
          eq(patientMedicinesTable.isDeleted, false),
        ),
      );
    return result;
  }

  async updatePatientMedicine(
    input: UpdatePatientMedicineInput,
  ): Promise<PatientMedicine | undefined> {
    const { id, ...updates } = input;
    const [result] = await this.db
      .update(patientMedicinesTable)
      .set({
        ...updates,
      })
      .where(eq(patientMedicinesTable.id, id))
      .returning();
    return result;
  }

  async deletePatientMedicine(
    id: string,
  ): Promise<PatientMedicine | undefined> {
    const [result] = await this.db
      .update(patientMedicinesTable)
      .set({
        isDeleted: true,
      })
      .where(eq(patientMedicinesTable.id, id))
      .returning();
    return result;
  }
}
