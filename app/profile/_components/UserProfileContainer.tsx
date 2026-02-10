import { createClient } from "@/utils/supabase/server";
import UserProfile from "./UserProfile";
import { Profile } from "@/types";

export default async function UserProfileContainer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Supabase error fetching profile:", error);
    return null;
  }

  const formattedProfile: Profile = {
    ...profile,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
  };

  return <UserProfile profile={formattedProfile} />;
}
