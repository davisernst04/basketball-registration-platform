"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { TryoutFormData, ServerActionResponse, Tryout } from "@/types";
import { tryoutSchema } from "@/lib/validations";

export async function createTryout(formData: TryoutFormData): Promise<ServerActionResponse<Tryout>> {
  try {
    // Validate input with Zod
    const validatedFields = tryoutSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: validatedFields.error.errors.map(e => e.message).join(", ") 
      };
    }

    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, message: "Forbidden: Admin access required" };
    }

    const { location, date, startTime, endTime, ageGroup, maxCapacity, notes } = validatedFields.data;

    const { data: tryout, error: createError } = await supabase
      .from("tryout")
      .insert({
        location,
        date: date.toISOString(),
        start_time: startTime,
        end_time: endTime,
        age_group: ageGroup,
        max_capacity: maxCapacity || null,
        notes,
      })
      .select()
      .single();

    if (createError) throw createError;

    revalidatePath("/dashboard");
    revalidatePath("/register");
    revalidatePath("/tryouts");

    const formattedTryout: Tryout = {
      ...tryout,
      startTime: tryout.start_time,
      endTime: tryout.end_time,
      ageGroup: tryout.age_group,
      maxCapacity: tryout.max_capacity,
    };

    return { 
      success: true, 
      message: "Tryout created successfully", 
      data: formattedTryout
    };
  } catch (error) {
    console.error("Supabase error creating tryout:", error);
    return { 
      success: false, 
      message: "Failed to create tryout", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function updateTryout(formData: TryoutFormData): Promise<ServerActionResponse<Tryout>> {
  try {
    const { id, ...rest } = formData;
    if (!id) {
      return { success: false, message: "Tryout ID is required" };
    }

    // Validate input with Zod
    const validatedFields = tryoutSchema.safeParse(rest);

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: validatedFields.error.errors.map(e => e.message).join(", ") 
      };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, message: "Forbidden" };
    }

    const { location, date, startTime, endTime, ageGroup, maxCapacity, notes } = validatedFields.data;

    const { data: tryout, error: updateError } = await supabase
      .from("tryout")
      .update({
        location,
        date: date.toISOString(),
        start_time: startTime,
        end_time: endTime,
        age_group: ageGroup,
        max_capacity: maxCapacity || null,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    revalidatePath("/dashboard");
    revalidatePath("/register");
    revalidatePath("/tryouts");

    const formattedTryout: Tryout = {
      ...tryout,
      startTime: tryout.start_time,
      endTime: tryout.end_time,
      ageGroup: tryout.age_group,
      maxCapacity: tryout.max_capacity,
    };

    return { 
      success: true, 
      message: "Tryout updated successfully", 
      data: formattedTryout
    };
  } catch (error) {
    console.error("Supabase error updating tryout:", error);
    return { success: false, message: "Failed to update tryout" };
  }
}

export async function deleteTryout(id: string): Promise<ServerActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, message: "Forbidden" };
    }

    const { error: deleteError } = await supabase
      .from("tryout")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard");
    revalidatePath("/register");
    revalidatePath("/tryouts");

    return { success: true, message: "Tryout deleted successfully" };
  } catch (error) {
    console.error("Supabase error deleting tryout:", error);
    return { success: false, message: "Failed to delete tryout" };
  }
}