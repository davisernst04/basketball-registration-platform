-- Fix search_path for handle_updated_at function
ALTER FUNCTION public.handle_updated_at() SET search_path = public;

-- Ensure indexes exist (they were in init.sql but missing in live DB)
CREATE INDEX IF NOT EXISTS idx_registration_tryout_id ON public.registration (tryout_id);
CREATE INDEX IF NOT EXISTS idx_registration_user_id ON public.registration (user_id);

-- Optimize RLS policies for Performance (Auth RLS Init Plan)
-- and resolve Multiple Permissive Policies warnings.

-- Tryout table
DROP POLICY IF EXISTS "Allow admin full access on tryouts" ON public.tryout;
DROP POLICY IF EXISTS "Allow public read access on tryouts" ON public.tryout;

CREATE POLICY "Allow admin full access on tryouts" ON public.tryout
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Allow public read access on tryouts" ON public.tryout
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

-- Registration table
DROP POLICY IF EXISTS "Allow admin full access on registrations" ON public.registration;
DROP POLICY IF EXISTS "Allow public registration" ON public.registration;
DROP POLICY IF EXISTS "Allow users to view their own registrations" ON public.registration;

CREATE POLICY "Allow admin full access on registrations" ON public.registration
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Allow public registration" ON public.registration
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow users to view their own registrations" ON public.registration
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = user_id
    );

-- Profile table
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = id
    );

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT auth.uid()) = id
    );;
