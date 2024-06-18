CREATE TABLE IF NOT EXISTS "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"gender" "gender" NOT NULL,
	"mobile_number" text NOT NULL,
	"patient_age" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_id_unique" UNIQUE("id")
);
