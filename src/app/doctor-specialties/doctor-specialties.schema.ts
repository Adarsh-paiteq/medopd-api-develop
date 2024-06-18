import { doctorsTable } from '@doctors/doctors.schema';
import { medicalSpecialtiesTable } from '@medical-specialties/medical-specialties.schema';
import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

const tableName = 'doctor_specialties';
export const doctorSpecialtiesTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    doctorId: text('doctor_id')
      .notNull()
      .references(() => doctorsTable.id),
    specialtyId: text('specialty_id')
      .notNull()
      .references(() => medicalSpecialtiesTable.id),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    doctorIdSpecialtyIdUnique: unique('doctor_id_specialty_id_unique').on(
      table.doctorId,
      table.specialtyId,
    ),
  }),
);

export type DoctorSpecialty = typeof doctorSpecialtiesTable.$inferSelect;
