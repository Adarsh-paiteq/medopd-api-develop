CREATE TABLE IF NOT EXISTS "medical_councils" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medical_councils_id_unique" UNIQUE("id"),
	CONSTRAINT "medical_councils_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_degrees" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medical_degrees_id_unique" UNIQUE("id"),
	CONSTRAINT "medical_degrees_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medical_specialties" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medical_specialties_id_unique" UNIQUE("id"),
	CONSTRAINT "medical_specialties_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medical_councils_name_idx" ON "medical_councils" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medical_degrees_name_idx" ON "medical_degrees" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medical_specialties_name_idx" ON "medical_specialties" ("name");
