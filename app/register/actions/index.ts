"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { RegistrationFormData, ServerActionResponse, Registration, RegistrationStatus } from "@/types";
import { registrationSchema } from "@/lib/validations";
import { randomUUID } from "crypto";

export async function createRegistration(formData: RegistrationFormData): Promise<ServerActionResponse<Registration>> {
  console.log("Creating registration for:", formData.parentEmail);
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
      .eq("parent_email", parentEmail)
      .eq("player_name", playerName)
      .single();

    if (existingReg) {
      return {
        success: true,
        message: "You are already registered for this tryout session.",
        data: mapRegistration(existingReg),
        status: 'REGISTRATION_SUCCESS'
      };
    }

    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    let userId = user?.id || null;
    let status: RegistrationStatus = userId ? 'REGISTRATION_SUCCESS' : 'REGISTRATION_SUCCESS';

    // Initialize Admin Client for privileged operations
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = (serviceKey && process.env.NEXT_PUBLIC_SUPABASE_URL) 
      ? createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey)
      : null;

    if (!userId) {
      // Check for existing user by email in profiles
      try {
        const clientForCheck = supabaseAdmin || supabase;
        const { data: existingProfile } = await clientForCheck
          .from("profiles")
          .select("id")
          .eq("email", parentEmail)
          .single();

         if (existingProfile) {
          status = 'EXISTING_USER_FOUND';
        }
      } catch (err) {
        console.warn("Error checking existing profile (ignoring):", err);
      }

      // New User Scenario: Attempt to invite user
      if (status !== 'EXISTING_USER_FOUND' && supabaseAdmin) {
        try {
          const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(parentEmail, {
            data: { full_name: parentName }
          });

          if (!inviteError && inviteData.user) {
            userId = inviteData.user.id;
            status = 'NEW_USER_CREATED';
          } else {
            console.warn("Invite failed:", inviteError);
          }
        } catch (err) {
          console.error("Failed to invite user:", err);
        }
      }
    }

    const insertData = {
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
      user_id: userId,
    };

    let resultData: Registration;

    // Use admin client if available to ensure we can select the return data
    if (supabaseAdmin) {
      const { data: registration, error: regError } = await supabaseAdmin
        .from("registration")
        .insert(insertData)
        .select()
        .single();

      if (regError) {
        console.error("Registration insert error (admin):", regError);
        throw regError;
      }
      resultData = mapRegistration(registration);
    } else {
      // Fallback: Use standard client.
      // If user is anon (guest), RLS prevents SELECT after insert.
      // So we generate ID manually and don't select.
      const generatedId = randomUUID();
      const { error: regError } = await supabase
        .from("registration")
        .insert({
          ...insertData,
          id: generatedId // Manually provide ID
        });
        // Note: No .select() here to avoid RLS error for anon users

      if (regError) {
        console.error("Registration insert error (public):", regError);
        throw regError;
      }

      // Construct the response object manually
      resultData = {
        id: generatedId,
        parentName: insertData.parent_name,
        parentEmail: insertData.parent_email,
        parentPhone: insertData.parent_phone,
        playerName: insertData.player_name,
        playerAge: insertData.player_age,
        playerGrade: insertData.player_grade,
        medicalInfo: insertData.medical_info,
        emergencyContact: insertData.emergency_contact,
        emergencyPhone: insertData.emergency_phone,
        tryoutId: insertData.tryout_id,
        userId: insertData.user_id,
      };
    }

    revalidatePath("/dashboard");

    let message = "Registration successful!";
    if (status === 'NEW_USER_CREATED') {
      message = "Registration successful! Check your email to set up your account.";
    } else if (status === 'EXISTING_USER_FOUND') {
      message = "Registration successful! Please login to view this in your dashboard.";
    }

    return { 
      success: true, 
      message, 
      data: resultData,
      status
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
