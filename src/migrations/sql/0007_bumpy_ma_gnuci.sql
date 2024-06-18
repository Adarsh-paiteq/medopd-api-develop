DO $$ BEGIN
 CREATE TYPE "gender" AS ENUM('male', 'female', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctors" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text,
	"gender" "gender",
	"image_file_path" text,
	"image_id" text,
	"image_url" text,
	"mobile_number" text NOT NULL,
	"country_code" text NOT NULL,
	"city" text,
	"earning_balance" integer DEFAULT 0 NOT NULL,
	"otp_secret" text,
	"specialty_ids" text,
	"qulification_id" text,
	"registration_number" text,
	"state" text,
	"council_id" text,
	"registration_year" text,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"refresh_token" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "doctors_id_unique" UNIQUE("id")
);
