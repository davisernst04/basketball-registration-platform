-- Allow users to view registrations that match their email, even if user_id is not yet linked
create policy "Allow users to view own registrations by email"
on public.registration
for select
using (
  lower(parent_email) = lower((select auth.jwt() ->> 'email'))
);
