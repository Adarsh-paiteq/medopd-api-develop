ALTER TABLE "doctors" ADD COLUMN "admin_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "clinic_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "booking_charges" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "admins" DROP COLUMN IF EXISTS "admission_commission";--> statement-breakpoint
ALTER TABLE "clinics" DROP COLUMN IF EXISTS "clinic_commission";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "doctor_commission";