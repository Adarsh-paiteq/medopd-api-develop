ALTER TABLE "admins" ALTER COLUMN "earning_balance" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "clinic_earning" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "doctor_earning" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "admin_earning" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "earning_balance" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "wallet_balance" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "earning_balance" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "admin_commission" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "clinic_commission" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "booking_charges" SET DATA TYPE numeric(20, 5);