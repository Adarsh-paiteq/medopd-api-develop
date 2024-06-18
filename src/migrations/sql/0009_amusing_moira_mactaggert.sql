ALTER TABLE "doctors" ADD COLUMN "city_id" text;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "degree_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_degree_id_medical_degrees_id_fk" FOREIGN KEY ("degree_id") REFERENCES "medical_degrees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_council_id_medical_councils_id_fk" FOREIGN KEY ("council_id") REFERENCES "medical_councils"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "specialty_ids";--> statement-breakpoint
ALTER TABLE "doctors" DROP COLUMN IF EXISTS "qulification_id";