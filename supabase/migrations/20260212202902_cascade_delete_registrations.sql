ALTER TABLE "public"."registration"
DROP CONSTRAINT IF EXISTS "registration_user_id_fkey";

ALTER TABLE "public"."registration"
ADD CONSTRAINT "registration_user_id_fkey"
FOREIGN KEY ("user_id")
REFERENCES "auth"."users"("id")
ON DELETE CASCADE;