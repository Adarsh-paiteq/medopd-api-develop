DO $$ BEGIN
 CREATE TYPE "medicines_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medicines" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"medicines_status" "medicines_status" DEFAULT 'pending' NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medicines_id_unique" UNIQUE("id"),
	CONSTRAINT "medicines_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "prescriptions" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "medicines_name_idx" ON "medicines" ("name");