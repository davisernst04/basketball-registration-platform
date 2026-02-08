"use server";

import { createClient } from "@/utils/supabase/server";
import { Profile, ServerActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProfile(): Promise<ServerActionResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, message: "Profile not found" };
    }

    const mappedProfile: Profile = {
      id: profile.id,
      username: profile.username,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      website: profile.website,
      role: profile.role,
      email: user.email || null,
    };

    return { success: true, message: "Profile fetched", data: mappedProfile };
  } catch (error) {
    console.error("Supabase error fetching profile:", error);
    return { success: false, message: "Failed to fetch profile" };
  }
}

export async function updateProfile(formData: {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}): Promise<ServerActionResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({
        username: formData.username,
        full_name: formData.fullName,
        avatar_url: formData.avatarUrl,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    revalidatePath("/profile");

    const mappedProfile: Profile = {
      id: updatedProfile.id,
      username: updatedProfile.username,
      fullName: updatedProfile.full_name,
      avatarUrl: updatedProfile.avatar_url,
      website: updatedProfile.website,
      role: updatedProfile.role,
      email: user.email || null,
    };

    return { success: true, message: "Profile updated successfully", data: mappedProfile };
  } catch (error) {
    console.error("Supabase error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}
