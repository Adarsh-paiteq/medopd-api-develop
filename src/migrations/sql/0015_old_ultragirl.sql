DO $$ BEGIN
 CREATE TYPE "booking_status" AS ENUM('PENDING', 'ACCEPT', 'DECLINE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "consult_type" AS ENUM('Audio', 'Video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "language" AS ENUM('English', 'Hindi', 'Bengali', 'Marathi', 'Telgu', 'Tamil', 'Urdu', 'kannadda', 'Punjabi', 'Odia', 'Maithili');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "symptoms" AS ENUM('Typhoid', 'Dengu', 'Jaundice', 'Heart Attack', 'High Fever');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"clinic_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"bp" text NOT NULL,
	"booking_id" text NOT NULL,
	"symptoms" "symptoms" NOT NULL,
	"other_symptoms" text NOT NULL,
	"booking_status" "booking_status" DEFAULT 'PENDING' NOT NULL,
	"consult_type" "consult_type" NOT NULL,
	"language" "language" NOT NULL,
	"clinic_earning" double precision DEFAULT 0 NOT NULL,
	"doctor_earning" double precision DEFAULT 0 NOT NULL,
	"admin_earning" double precision DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
