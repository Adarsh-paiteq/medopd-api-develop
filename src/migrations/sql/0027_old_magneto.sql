DO $$ BEGIN
 CREATE TYPE "duration" AS ENUM('1 Day', '2 Days', '3 Days', '4 Days', '5 Days', '6 Days', '1 Week', '2 Weeks', '3 Weeks', '4 Weeks');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "frequency" AS ENUM('Daily', 'Weekly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "instruction" AS ENUM('Before meal', 'After meal', 'Others');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_medicines" (
	"id" text PRIMARY KEY NOT NULL,
	"prescription_id" text NOT NULL,
	"booking_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"name" text NOT NULL,
	"morning_dosage" integer DEFAULT 0 NOT NULL,
	"afternoon_dosage" integer DEFAULT 0 NOT NULL,
	"night_dosage" integer DEFAULT 0 NOT NULL,
	"frequency" "frequency" NOT NULL,
	"duration" "duration" NOT NULL,
	"instruction" "instruction" NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_medicines_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_medicines" ADD CONSTRAINT "patient_medicines_prescription_id_prescriptions_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_medicines" ADD CONSTRAINT "patient_medicines_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_medicines" ADD CONSTRAINT "patient_medicines_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
