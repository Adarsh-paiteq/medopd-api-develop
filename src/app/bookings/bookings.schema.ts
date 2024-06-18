import { clinicsTable } from '@clinics/clinics.schema';
import { doctorsTable } from '@doctors/doctors.schema';
import { patientsTable } from '@patients/patients.schema';
import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
export const SymptomsEnum = pgEnum('symptoms', [
  'Typhoid',
  'Dengu',
  'Jaundice',
  'Heart Attack',
  'High Fever',
]);

export const BookingStatusEnum = pgEnum('booking_status', [
  'PENDING',
  'ACCEPT',
  'DECLINE',
]);
export const ConsultTypeEnum = pgEnum('consult_type', ['Audio', 'Video']);
export const LanguageEnum = pgEnum('language', [
  'English',
  'Hindi',
  'Bengali',
  'Marathi',
  'Telgu',
  'Tamil',
  'Urdu',
  'kannadda',
  'Punjabi',
  'Odia',
  'Maithili',
]);

const tableName = 'bookings';
export const bookingsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  clinicId: text('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  patientId: text('patient_id')
    .notNull()
    .references(() => patientsTable.id),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctorsTable.id),
  bp: text('bp').notNull(),
  bookingId: text('booking_id').notNull(),
  symptoms: SymptomsEnum('symptoms'),
  otherSymptoms: text('other_symptoms'),
  bookingStatus: BookingStatusEnum('booking_status')
    .default('PENDING')
    .notNull(),
  consultType: ConsultTypeEnum('consult_type').notNull(),
  language: LanguageEnum('language').notNull(),
  clinicEarning: numeric('clinic_earning', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  doctorEarning: numeric('doctor_earning', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  adminEarning: numeric('admin_earning', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  pulse: text('pulse'),
  oxygenSaturation: text('oxygen_saturation'),
  medicalHistory: text('medical_history'),
  abdominalTenderness: boolean('abdominal_tenderness').default(false).notNull(),
  patientNote: text('patient_note'),
  pedalOedema: boolean('pedal_oedema').default(false).notNull(),
  imageFilePath: text('image_file_path'),
  imageId: text('image_id'),
  imageUrl: text('image_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Booking = typeof bookingsTable.$inferSelect;
