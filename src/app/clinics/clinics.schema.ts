import { citiesTable } from '@cities/cities.schema';
import {
  boolean,
  doublePrecision,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
export const StatusEnum = pgEnum('status', ['pending', 'approved', 'rejected']);
const tableName = 'clinics';
export const clinicsTable = pgTable(tableName, {
  id: text('id').primaryKey().notNull().unique(),
  email: text('email').unique(),
  fullName: text('full_name'),
  clinicName: text('clinic_name').unique(),
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
  otpSecret: text('otp_secret'),
  isMobileVerified: boolean('is_mobile_verified').default(false).notNull(),
  status: StatusEnum('status').default('pending').notNull(),
  address: text('address'),
  postalCode: text('postal_code'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  landmark: text('landmark'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  refreshToken: text('refresh_token'),
  walletBalance: numeric('wallet_balance', { precision: 20, scale: 5 })
    .$type<number>()
    .default(0)
    .notNull(),
});

export type Clinic = typeof clinicsTable.$inferSelect;
