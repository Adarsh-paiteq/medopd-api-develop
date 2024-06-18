CREATE TABLE IF NOT EXISTS "banners" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_file_path" text NOT NULL,
	"image_id" text NOT NULL,
	"image_url" text NOT NULL,
	"is_disable" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banners_id_unique" UNIQUE("id"),
	CONSTRAINT "banners_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "latitude" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "longitude" SET DATA TYPE double precision;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "banners_title_idx" ON "banners" ("title");