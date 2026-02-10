"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ServerActionResponse, Profile } from "@/types";

export async function updateProfile(formData: {
  fullName: string;
  avatarUrl: string;
}): Promise<ServerActionResponse<Profile>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { fullName, avatarUrl } = formData;

    if (!fullName) {
      return { success: false, message: "Full name is required" };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/profile");

    return { 
      success: true, 
      message: "Profile updated successfully", 
      data: {
        ...profile,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
      } as Profile
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { 
      success: false, 
      message: "Failed to update profile", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
