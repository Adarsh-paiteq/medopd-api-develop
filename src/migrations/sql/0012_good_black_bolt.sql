ALTER TABLE "clinics" ADD COLUMN "city_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clinics" ADD CONSTRAINT "clinics_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "clinics" DROP COLUMN IF EXISTS "city";