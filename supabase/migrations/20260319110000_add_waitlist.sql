-- Add waitlist table for full tryouts
CREATE TABLE IF NOT EXISTS "public"."waitlist" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tryout_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "player_name" "text" NOT NULL,
    "player_age" integer NOT NULL,
    "player_grade" "text" NOT NULL,
    "parent_name" "text" NOT NULL,
    "parent_email" "text" NOT NULL,
    "parent_phone" "text" NOT NULL,
    "emergency_contact" "text" NOT NULL,
    "emergency_phone" "text" NOT NULL,
    "medical_info" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "waitlist_tryout_id_fkey" FOREIGN KEY ("tryout_id") REFERENCES "public"."tryout"("id") ON DELETE CASCADE,
    CONSTRAINT "waitlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

-- Add unique constraint to prevent duplicate waitlist entries
CREATE UNIQUE INDEX "waitlist_user_tryout_unique" ON "public"."waitlist" ("user_id", "tryout_id");

-- Enable RLS
ALTER TABLE "public"."waitlist" ENABLE ROW LEVEL SECURITY;

-- Policies: users can see their own waitlist entries, admins can see all
CREATE POLICY "Users can view own waitlist entries" ON "public"."waitlist"
    FOR SELECT USING ("user_id" = auth.uid());

CREATE POLICY "Admins can view all waitlist entries" ON "public"."waitlist"
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM "public"."profiles" WHERE "id" = auth.uid() AND "role" = 'admin')
    );

CREATE POLICY "Users can insert own waitlist entries" ON "public"."waitlist"
    FOR INSERT WITH CHECK ("user_id" = auth.uid());

CREATE POLICY "Admins can delete waitlist entries" ON "public"."waitlist"
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM "public"."profiles" WHERE "id" = auth.uid() AND "role" = 'admin')
    );