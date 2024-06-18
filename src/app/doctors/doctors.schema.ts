import { citiesTable } from '@cities/cities.schema';
import { medicalCouncilsTable } from '@medical-councils/medical-councils.schema';
import { medicalDegreesTable } from '@medical-degrees/medical-degrees.schema';
import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
export const GenderEnum = pgEnum('gender', ['male', 'female', 'other']);
const tableName = 'doctors';
export const doctorsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  fullName: text('full_name'),
  gender: GenderEnum('gender'),
  imageFilePath: text('image_file_path'),
  imageId: text('image_id'),
  imageUrl: text('image_url'),
  mobileNumber: text('mobile_number').notNull(),
  countryCode: text('country_code').notNull(),
  cityId: text('city_id').references(() => citiesTable.id),
  earningBalance: numeric('earning_balance', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  adminCommission: numeric('admin_commission', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  clinicCommission: numeric('clinic_commission', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  bookingCharges: numeric('booking_charges', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
  otpSecret: text('otp_secret'),
  degreeId: text('degree_id').references(() => medicalDegreesTable.id),
  registrationNumber: text('registration_number'),
  state: text('state'),
  councilId: text('council_id').references(() => medicalCouncilsTable.id),
  registrationYear: text('registration_year'),
  isOnboarded: boolean('is_onboarded').default(false).notNull(),
  refreshToken: text('refresh_token'),
  isActive: boolean('is_active').default(false).notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Doctor = typeof doctorsTable.$inferSelect;
