-- Ensure the function is up to date with email handling and linking logic
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
  UPDATE public.registration
  SET user_id = new.id
  WHERE parent_email = new.email AND user_id IS NULL;

  return new;
end;
$$;

-- Drop the trigger if it exists to ensure a clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
