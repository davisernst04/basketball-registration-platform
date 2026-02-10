-- Refine RLS policies for better performance and security

-- Tryout table
DROP POLICY IF EXISTS "Allow admin full access on tryouts" ON public.tryout;
CREATE POLICY "Allow admin full access on tryouts" ON public.tryout
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Registration table
DROP POLICY IF EXISTS "Allow admin full access on registrations" ON public.registration;
CREATE POLICY "Allow admin full access on registrations" ON public.registration
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin'
    );

DROP POLICY IF EXISTS "Allow public registration" ON public.registration;
CREATE POLICY "Allow public registration" ON public.registration
    FOR INSERT
    TO public
    WITH CHECK (
        parent_email IS NOT NULL AND 
        tryout_id IS NOT NULL
    );

DROP POLICY IF EXISTS "Allow users to view their own registrations" ON public.registration;
CREATE POLICY "Allow users to view their own registrations" ON public.registration
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = user_id
    );
