DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clinics" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"full_name" text,
	"clinic_name" text,
	"image_file_path" text,
	"image_id" text,
	"image_url" text,
	"mobile_number" text NOT NULL,
	"country_code" text NOT NULL,
	"city" text,
	"earning_balance" integer DEFAULT 0 NOT NULL,
	"otp_secret" text,
	"is_mobile_verified" boolean DEFAULT false NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"address" text,
	"postal_code" text,
	"latitude" integer,
	"longitude" integer,
	"landmark" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clinics_id_unique" UNIQUE("id"),
	CONSTRAINT "clinics_email_unique" UNIQUE("email"),
	CONSTRAINT "clinics_clinic_name_unique" UNIQUE("clinic_name")
);
