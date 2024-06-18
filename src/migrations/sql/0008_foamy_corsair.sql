ALTER TABLE "doctors" ALTER COLUMN "specialty_ids" TYPE text[] USING string_to_array("specialty_ids",'')
