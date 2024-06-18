import { bookingsTable } from '@bookings/bookings.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

const tableName = 'prescriptions';
export const prescriptionsTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    bookingId: text('booking_id')
      .notNull()
      .references(() => bookingsTable.id),
    doctorId: text('doctor_id')
      .notNull()
      .references(() => doctorsTable.id),
    generalInstruction: text('general_instruction'),
    updatedAt: timestamp('updated_at')
      .$onUpdateFn(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    doctorIdBookingIdUnique: unique('doctor_id_booking_id_unique').on(
      table.doctorId,
      table.bookingId,
    ),
  }),
);

export type Prescription = typeof prescriptionsTable.$inferSelect;
