ALTER TABLE "public"."tryout" 
ADD COLUMN "registration_deadline" timestamp with time zone;

ALTER TABLE "public"."tryout" 
ALTER COLUMN "start_time" DROP NOT NULL;

ALTER TABLE "public"."tryout" 
ALTER COLUMN "end_time" DROP NOT NULL;
