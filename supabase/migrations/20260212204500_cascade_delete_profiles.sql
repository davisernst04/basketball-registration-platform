DELETE FROM "public"."profiles" WHERE "id" NOT IN (SELECT "id" FROM "auth"."users");
DELETE FROM "public"."registration" WHERE "user_id" IS NOT NULL AND "user_id" NOT IN (SELECT "id" FROM "auth"."users");

ALTER TABLE "public"."profiles"
DROP CONSTRAINT IF EXISTS "profiles_id_fkey";

ALTER TABLE "public"."profiles"
ADD CONSTRAINT "profiles_id_fkey"
FOREIGN KEY ("id")
REFERENCES "auth"."users"("id")
ON DELETE CASCADE;

ALTER TABLE "public"."registration"
DROP CONSTRAINT IF EXISTS "registration_user_id_fkey";

ALTER TABLE "public"."registration"
ADD CONSTRAINT "registration_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "auth"."users"("id")
ON DELETE CASCADE;