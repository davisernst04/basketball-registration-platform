"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { RegistrationFormData, ServerActionResponse, Registration } from "@/types";
import { registrationSchema } from "@/lib/validations";

export async function createRegistration(formData: RegistrationFormData): Promise<ServerActionResponse<Registration>> {
  console.log("Creating registration for tryout:", formData.tryoutId);
  try {
    // Validate input with Zod
    const validatedFields = registrationSchema.safeParse(formData);

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return { 
        success: false, 
        message: "Validation failed", 
        error: validatedFields.error.issues.map(e => e.message).join(", ") 
      };
    }

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "You must be signed in to register for a tryout." };
    }

    // Server-side validation enforcement:
    // Fetch the user's profile to get the trusted parentName and parentEmail
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // Use profile data if available, otherwise fall back to auth user data (which is also trusted)
    const trustedParentName = profile?.full_name || user.user_metadata?.full_name || validatedFields.data.parentName; // Fallback to form data only if strictly necessary, but preferably user metadata
    const trustedParentEmail = profile?.email || user.email || validatedFields.data.parentEmail;

    // We allow parentPhone to be updated from the form, as per requirements

    const {
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
      console.error("Tryout lookup error:", tryoutError);
      return { success: false, message: "Tryout session not found" };
    }

    const registrationCount = tryout.registration[0]?.count || 0;

    if (
      tryout.max_capacity !== null &&
      registrationCount >= tryout.max_capacity
    ) {
      return { success: false, message: "This tryout session is full" };
    }

    // Idempotency Check: Check if registration already exists
    const { data: existingReg } = await supabase
      .from("registration")
      .select("*")
      .eq("tryout_id", tryoutId)
      .eq("user_id", user.id)
      .single();

    if (existingReg) {
      return {
        success: true,
        message: "You are already registered for this tryout session.",
        data: mapRegistration(existingReg),
        status: 'REGISTRATION_SUCCESS'
      };
    }

    const insertData = {
      parent_name: trustedParentName, // Enforced
      parent_email: trustedParentEmail, // Enforced
      parent_phone: parentPhone, // Editable
      player_name: playerName,
      player_age: parseInt(playerAge.toString()),
      player_grade: playerGrade,
      medical_info: medicalInfo || null,
      emergency_contact: emergencyContact,
      emergency_phone: emergencyPhone,
      tryout_id: tryoutId,
      user_id: user.id,
    };

    const { data: registration, error: regError } = await supabase
        .from("registration")
        .insert(insertData)
        .select()
        .single();

      if (regError) {
        console.error("Registration insert error:", regError);
        throw regError;
      }
      
    const resultData = mapRegistration(registration);

    revalidatePath("/dashboard");

    return { 
      success: true, 
      message: "Registration successful! View details in your dashboard.", 
      data: resultData,
      status: 'REGISTRATION_SUCCESS'
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

function mapRegistration(reg: any): Registration {
  return {
    ...reg,
    parentName: reg.parent_name,
    parentEmail: reg.parent_email,
    parentPhone: reg.parent_phone,
    playerName: reg.player_name,
    playerAge: reg.player_age,
    playerGrade: reg.player_grade,
    medicalInfo: reg.medical_info,
    emergencyContact: reg.emergency_contact,
    emergencyPhone: reg.emergency_phone,
    tryoutId: reg.tryout_id,
    userId: reg.user_id,
  };
}

// Join waitlist for full tryouts
export async function joinWaitlist(formData: RegistrationFormData): Promise<ServerActionResponse> {
  console.log("Adding to waitlist for tryout:", formData.tryoutId);
  try {
    const validatedFields = registrationSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        error: validatedFields.error.issues.map(e => e.message).join(", ")
      };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "You must be signed in to join the waitlist." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const trustedParentName = profile?.full_name || user.user_metadata?.full_name || validatedFields.data.parentName;
    const trustedParentEmail = profile?.email || user.email || validatedFields.data.parentEmail;

    const {
      parentPhone,
      playerName,
      playerAge,
      playerGrade,
      medicalInfo,
      emergencyContact,
      emergencyPhone,
      tryoutId,
    } = validatedFields.data;

    // Check if already on waitlist
    const { data: existingWaitlist } = await supabase
      .from("waitlist")
      .select("id")
      .eq("tryout_id", tryoutId)
      .eq("user_id", user.id)
      .single();

    if (existingWaitlist) {
      return {
        success: true,
        message: "You are already on the waitlist for this tryout session.",
        status: 'WAITLIST_SUCCESS'
      };
    }

    // Check if already registered
    const { data: existingReg } = await supabase
      .from("registration")
      .select("id")
      .eq("tryout_id", tryoutId)
      .eq("user_id", user.id)
      .single();

    if (existingReg) {
      return {
        success: false,
        message: "You are already registered for this tryout session."
      };
    }

    const insertData = {
      tryout_id: tryoutId,
      user_id: user.id,
      player_name: playerName,
      player_age: parseInt(playerAge.toString()),
      player_grade: playerGrade,
      parent_name: trustedParentName,
      parent_email: trustedParentEmail,
      parent_phone: parentPhone,
      emergency_contact: emergencyContact,
      emergency_phone: emergencyPhone,
      medical_info: medicalInfo || null,
    };

    const { error } = await supabase
      .from("waitlist")
      .insert(insertData);

    if (error) {
      console.error("Waitlist insert error:", error);
      throw error;
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "You've been added to the waitlist! We'll contact you if a spot opens up.",
      status: 'WAITLIST_SUCCESS'
    };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      message: "Failed to join waitlist",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}