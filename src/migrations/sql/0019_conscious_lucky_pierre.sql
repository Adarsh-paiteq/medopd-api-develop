ALTER TABLE "admins" ADD COLUMN "admission_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "clinic_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "doctor_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "booking_charges";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "clinic_commission";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "admission_commission";