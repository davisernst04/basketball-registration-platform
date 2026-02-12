-- Update handle_new_user to include email and link past registrations
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url', 
    new.email
  );
  
  -- Link past registrations where email matches and user_id is null
  -- This handles the "If a user registers and later creates an account, update their profile (link)" requirement
  UPDATE public.registration
  SET user_id = new.id
  WHERE parent_email = new.email AND user_id IS NULL;

  return new;
end;
$$;
