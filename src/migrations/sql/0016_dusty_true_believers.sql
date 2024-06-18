ALTER TABLE "admins" ALTER COLUMN "earning_balance" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "clinic_earning" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "doctor_earning" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "admin_earning" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "earning_balance" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "earning_balance" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "booking_charges" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "clinic_commission" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "admission_commission" real DEFAULT 0 NOT NULL;