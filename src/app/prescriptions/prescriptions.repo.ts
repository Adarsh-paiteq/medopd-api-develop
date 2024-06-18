import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Prescription, prescriptionsTable } from './prescriptions.schema';
import { CreatePrescriptionInputDto } from './dto/create-prescription.dto';
import { ulid } from 'ulid';
import { and, eq } from 'drizzle-orm';
import { GetPrescriptionWithMedicinesOutput } from './dto/get-prescription-with-medicines.dto';
import { patientMedicinesTable } from '@patient-medicines/patient-medicines.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { bookingsTable } from '@bookings/bookings.schema';
import { patientsTable } from '@patients/patients.schema';
import { medicalDegreesTable } from '@medical-degrees/medical-degrees.schema';
import { GeneratePrescriptionOutput } from './dto/generate-prescription.dto';
import { clinicsTable } from '@clinics/clinics.schema';
import { chatsTable } from '@chats/chats.schema';

@Injectable()
export class PrescriptionsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      prescriptionsTable: typeof prescriptionsTable;
    }>,
  ) {}

  async createPrescription(
    createPrescription: CreatePrescriptionInputDto,
  ): Promise<Prescription> {
    const [result] = await this.db
      .insert(prescriptionsTable)
      .values({
        id: ulid(),
        ...createPrescription,
      })
      .onConflictDoNothing({
        target: [prescriptionsTable.bookingId, prescriptionsTable.doctorId],
      })
      .returning();
    return result;
  }

  async getPrescriptionById(id: string): Promise<Prescription | undefined> {
    const [result] = await this.db
      .select()
      .from(prescriptionsTable)
      .where(eq(prescriptionsTable.id, id));
    return result;
  }

  async getPrescriptionWithMedicines(
    doctorId: string,
    bookingId: string,
  ): Promise<GetPrescriptionWithMedicinesOutput> {
    const [prescription] = await this.db
      .select()
      .from(prescriptionsTable)
      .where(
        and(
          eq(prescriptionsTable.doctorId, doctorId),
          eq(prescriptionsTable.bookingId, bookingId),
        ),
      );
    const medicines = await this.db
      .select()
      .from(patientMedicinesTable)
      .where(
        and(
          eq(patientMedicinesTable.prescriptionId, prescription.id),
          eq(patientMedicinesTable.isDeleted, false),
        ),
      );

    return {
      ...prescription,
      medicines,
    };
  }

  async updatePrescription(
    id: string,
    generalInstruction: string,
  ): Promise<Prescription | undefined> {
    const [result] = await this.db
      .update(prescriptionsTable)
      .set({ generalInstruction: generalInstruction })
      .where(eq(prescriptionsTable.id, id))
      .returning();
    return result;
  }

  async getGeneratePrescription(
    id: string,
  ): Promise<GeneratePrescriptionOutput> {
    const [prescription] = await this.db
      .select({
        id: prescriptionsTable.id,
        clinicId: bookingsTable.clinicId,
        chatId: chatsTable.id,
        doctorName: doctorsTable.fullName,
        doctorDegree: medicalDegreesTable.name,
        patientName: patientsTable.fullName,
        patientAge: patientsTable.patientAge,
        patientGender: patientsTable.gender,
        clinicName: clinicsTable.clinicName,
        bp: bookingsTable.bp,
        pulse: bookingsTable.pulse,
        complain: bookingsTable.patientNote,
        doctorRegistrationNumber: doctorsTable.registrationNumber,
        patientMobileNumber: patientsTable.mobileNumber,
        address: clinicsTable.address,
        postalCode: clinicsTable.postalCode,
      })
      .from(prescriptionsTable)
      .innerJoin(doctorsTable, eq(doctorsTable.id, prescriptionsTable.doctorId))
      .innerJoin(
        bookingsTable,
        eq(bookingsTable.id, prescriptionsTable.bookingId),
      )
      .innerJoin(clinicsTable, eq(clinicsTable.id, bookingsTable.clinicId))
      .innerJoin(
        chatsTable,
        eq(chatsTable.bookingId, prescriptionsTable.bookingId),
      )
      .innerJoin(
        medicalDegreesTable,
        eq(medicalDegreesTable.id, doctorsTable.degreeId),
      )
      .innerJoin(patientsTable, eq(patientsTable.id, bookingsTable.patientId))
      .where(eq(prescriptionsTable.id, id));

    const medicines = await this.db
      .select()
      .from(patientMedicinesTable)
      .where(
        and(
          eq(patientMedicinesTable.prescriptionId, prescription.id),
          eq(patientMedicinesTable.isDeleted, false),
        ),
      );
    return {
      ...prescription,
      medicines,
    };
  }
}
