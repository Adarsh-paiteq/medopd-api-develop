CREATE TABLE IF NOT EXISTS "doctor_specialties" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"specialty_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "doctor_specialties_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialty_id_medical_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "medical_specialties"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
