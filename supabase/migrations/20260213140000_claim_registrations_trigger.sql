-- Function to claim registrations for new or newly verified users
create or replace function public.claim_guest_registrations()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Only proceed if the email is confirmed
  if NEW.email_confirmed_at is not null then
    update public.registration
    set user_id = NEW.id
    where lower(parent_email) = lower(NEW.email)
    and user_id is null;
  end if;
  return NEW;
end;
$$;

-- Trigger for INSERT (e.g. Google Auth where email is already confirmed)
drop trigger if exists on_auth_user_created_claim_registrations on auth.users;
create trigger on_auth_user_created_claim_registrations
  after insert on auth.users
  for each row execute procedure public.claim_guest_registrations();

-- Trigger for UPDATE (e.g. Email verification flow)
drop trigger if exists on_auth_user_verified_claim_registrations on auth.users;
create trigger on_auth_user_verified_claim_registrations
  after update on auth.users
  for each row
  when (OLD.email_confirmed_at is null and NEW.email_confirmed_at is not null)
  execute procedure public.claim_guest_registrations();
