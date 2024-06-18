ALTER TABLE "bookings" ADD COLUMN "pulse" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "oxygen_saturation" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "medical_history" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "abdominal_tenderness" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "patient_note" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pedal_oedema" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "image_file_path" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "image_id" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "image_url" text;