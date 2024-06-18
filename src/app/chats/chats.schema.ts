import { bookingsTable } from '@bookings/bookings.schema';
import { clinicsTable } from '@clinics/clinics.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { patientsTable } from '@patients/patients.schema';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'chats';
export const chatsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  bookingId: text('booking_id')
    .notNull()
    .references(() => bookingsTable.id),
  clinicId: text('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  patientId: text('patient_id')
    .notNull()
    .references(() => patientsTable.id),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctorsTable.id),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Chat = typeof chatsTable.$inferSelect;
