"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { RegistrationFormData, ServerActionResponse, Registration } from "@/types";
import { registrationSchema } from "@/lib/validations";

export async function createRegistration(formData: RegistrationFormData): Promise<ServerActionResponse<Registration>> {
  try {
    // Validate input with Zod
    const validatedFields = registrationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return { 
        success: false, 
        message: "Validation failed", 
        error: validatedFields.error.errors.map(e => e.message).join(", ") 
      };
    }

    const supabase = await createClient();
    const {
      parentName,
      parentEmail,
      parentPhone,
      playerName,
      playerAge,
      playerGrade,
      medicalInfo,
      emergencyContact,
      emergencyPhone,
      tryoutId,
    } = validatedFields.data;

    // Check capacity using Supabase
    const { data: tryout, error: tryoutError } = await supabase
      .from("tryout")
      .select(`
        *,
        registration(count)
      `)
      .eq("id", tryoutId)
      .single();

    if (tryoutError || !tryout) {
      return { success: false, message: "Tryout session not found" };
    }

    const registrationCount = tryout.registration[0]?.count || 0;

    if (
      tryout.max_capacity !== null &&
      registrationCount >= tryout.max_capacity
    ) {
      return { success: false, message: "This tryout session is full" };
    }

    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    const { data: registration, error: regError } = await supabase
      .from("registration")
      .insert({
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
        player_name: playerName,
        player_age: parseInt(playerAge.toString()),
        player_grade: playerGrade,
        medical_info: medicalInfo || null,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        tryout_id: tryoutId,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (regError) throw regError;

    revalidatePath("/parent-dashboard");
    revalidatePath("/dashboard");

    const formattedRegistration: Registration = {
      ...registration,
      parentName: registration.parent_name,
      parentEmail: registration.parent_email,
      parentPhone: registration.parent_phone,
      playerName: registration.player_name,
      playerAge: registration.player_age,
      playerGrade: registration.player_grade,
      medicalInfo: registration.medical_info,
      emergencyContact: registration.emergency_contact,
      emergencyPhone: registration.emergency_phone,
      tryoutId: registration.tryout_id,
      userId: registration.user_id,
    };

    return { 
      success: true, 
      message: "Registration successful!", 
      data: formattedRegistration
    };
  } catch (error) {
    console.error("Supabase error creating registration:", error);
    return { 
      success: false, 
      message: "Failed to create registration", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}