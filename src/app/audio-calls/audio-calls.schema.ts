import { bookingsTable } from '@bookings/bookings.schema';
import { clinicsTable } from '@clinics/clinics.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'audio_calls';
export const audioCallsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  clinicId: text('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  bookingId: text('booking_id')
    .notNull()
    .references(() => bookingsTable.id),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctorsTable.id),
  sid: text('sid').notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdateFn(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AudioCall = typeof audioCallsTable.$inferSelect;
