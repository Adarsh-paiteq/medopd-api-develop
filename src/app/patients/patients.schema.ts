import { GenderEnum } from '@doctors/doctors.schema';
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
const tableName = 'patients';
export const patientsTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    fullName: text('full_name').notNull(),
    gender: GenderEnum('gender').notNull(),
    mobileNumber: text('mobile_number').notNull(),
    patientAge: integer('patient_age').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index(`${tableName}_${table.fullName.name}_idx`).on(
      table.fullName,
    ),
  }),
);

export type Patient = typeof patientsTable.$inferSelect;
