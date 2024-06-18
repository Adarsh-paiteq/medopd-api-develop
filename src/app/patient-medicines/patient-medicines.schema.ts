import { bookingsTable } from '@bookings/bookings.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { prescriptionsTable } from '@prescriptions/prescriptions.schema';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
export const FrequencyEnum = pgEnum('frequency', ['Daily', 'Weekly']);
export const DurationEnum = pgEnum('duration', [
  '1 Day',
  '2 Days',
  '3 Days',
  '4 Days',
  '5 Days',
  '6 Days',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '4 Weeks',
]);
export const InstructionEnum = pgEnum('instruction', [
  'Before meal',
  'After meal',
  'Others',
]);

const tableName = 'patient_medicines';
export const patientMedicinesTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  prescriptionId: text('prescription_id')
    .notNull()
    .references(() => prescriptionsTable.id),
  bookingId: text('booking_id')
    .notNull()
    .references(() => bookingsTable.id),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctorsTable.id),
  name: text('name').notNull(),
  morningDosage: integer('morning_dosage').default(0).notNull(),
  afternoonDosage: integer('afternoon_dosage').default(0).notNull(),
  nightDosage: integer('night_dosage').default(0).notNull(),
  frequency: FrequencyEnum('frequency').notNull(),
  duration: DurationEnum('duration').notNull(),
  instruction: InstructionEnum('instruction').notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdateFn(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type PatientMedicine = typeof patientMedicinesTable.$inferSelect;
