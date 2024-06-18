ALTER TABLE "clinics" ALTER COLUMN "earning_balance" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "earning_balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "wallet_balance" SET DATA TYPE numeric(20, 5);--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "wallet_balance" SET DEFAULT '0';