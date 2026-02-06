import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { RegistrationWithTryout } from "@/types/database";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: registrations, error } = await supabase
      .from("registration")
      .select(`
        *,
        tryout:tryout_id (
          age_group,
          date,
          location,
          start_time,
          end_time
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching registrations:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!registrations) {
      return NextResponse.json([]);
    }

    // Map to match frontend expectations (camelCase)
    const formattedRegistrations = (registrations as unknown as RegistrationWithTryout[]).map((reg) => ({
      id: reg.id,
      parentName: reg.parent_name,
      parentEmail: reg.parent_email,
      parentPhone: reg.parent_phone,
      playerName: reg.player_name,
      playerAge: reg.player_age,
      playerGrade: reg.player_grade,
      medicalInfo: reg.medical_info,
      emergencyContact: reg.emergency_contact,
      emergencyPhone: reg.emergency_phone,
      createdAt: reg.created_at,
      tryout: {
        ageGroup: reg.tryout?.age_group,
        date: reg.tryout?.date,
        location: reg.tryout?.location,
        startTime: reg.tryout?.start_time,
        endTime: reg.tryout?.end_time,
      },
    }));

    return NextResponse.json(formattedRegistrations);
  } catch (error) {
    console.error("Unexpected error fetching registrations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
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
    } = body;

    if (
      !parentName ||
      !parentEmail ||
      !parentPhone ||
      !playerName ||
      !playerAge ||
      !playerGrade ||
      !emergencyContact ||
      !emergencyPhone ||
      !tryoutId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check capacity
    const { data: tryout, error: tryoutError } = await supabase
      .from("tryout")
      .select(`
        id,
        max_capacity,
        registrations:registration(count)
      `)
      .eq("id", tryoutId)
      .single();

    if (tryoutError || !tryout) {
      return NextResponse.json(
        { error: "Tryout session not found" },
        { status: 404 }
      );
    }

    const regCount = (tryout.registrations as unknown as { count: number }[])[0]?.count || 0;

    if (
      tryout.max_capacity !== null &&
      regCount >= tryout.max_capacity
    ) {
      return NextResponse.json(
        { error: "This tryout session is full" },
        { status: 400 }
      );
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
        player_age: playerAge,
        player_grade: playerGrade,
        medical_info: medicalInfo || null,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        tryout_id: tryoutId,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (regError) {
      console.error("Supabase error creating registration:", regError);
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to create registration" },
      { status: 500 }
    );
  }
}
