ALTER TABLE "medical_councils" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_degrees" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "medical_specialties" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;