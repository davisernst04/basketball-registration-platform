import { createAdminClient } from "@/utils/supabase/server";

/**
 * Links any orphaned registrations (where user_id is NULL)
 * that match the current user's email address.
 * 
 * This is a self-healing mechanism to ensure guest registrations
 * are properly claimed when a user views their dashboard.
 */
export async function linkOrphanedRegistrations(userEmail: string | undefined, userId: string) {
  if (!userEmail) return;

  try {
    // We attempt to get the admin client. 
    // If SUPABASE_SERVICE_ROLE_KEY is missing, this will throw.
    const adminSupabase = await createAdminClient();
    
    // Update registration set user_id = current_user where email = user_email and user_id is null
    // We use ilike for case-insensitive matching to be robust
    const { data, error } = await adminSupabase
      .from("registration")
      .update({ user_id: userId })
      .ilike("parent_email", userEmail) // Case-insensitive match
      .is("user_id", null)
      .select();

    if (error) {
      console.error("Error linking orphaned registrations:", error.message);
    } else {
      console.log(`Self-healing: Linked ${data?.length || 0} registrations for ${userEmail}`);
    }
  } catch (error) {
    // If the service key is missing or invalid, we just log and continue.
    // This prevents the dashboard from crashing.
    console.warn("Skipping manual registration linking (Admin client unavailable):", error instanceof Error ? error.message : "Unknown error");
  }
}
