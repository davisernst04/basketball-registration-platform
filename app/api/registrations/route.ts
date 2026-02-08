import { NextResponse } from "next/server";
import { connection } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  await connection();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let registrationsQuery = supabase
      .from("registration")
      .select(`
        *,
        tryout (*)
      `)
      .order("created_at", { ascending: false });

    if (profile?.role !== "admin") {
      // Parents only see their own
      registrationsQuery = registrationsQuery.or(`user_id.eq.${user.id},parent_email.eq.${user.email}`);
    }

    const { data: registrations, error } = await registrationsQuery;

    if (error) throw error;

    const formattedRegistrations = registrations.map((r: any) => ({
      ...r,
      parentName: r.parent_name,
      parentEmail: r.parent_email,
      parentPhone: r.parent_phone,
      playerName: r.player_name,
      playerAge: r.player_age,
      playerGrade: r.player_grade,
      medicalInfo: r.medical_info,
      emergencyContact: r.emergency_contact,
      emergencyPhone: r.emergency_phone,
      tryoutId: r.tryout_id,
      userId: r.user_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      tryout: r.tryout ? {
        ...r.tryout,
        startTime: r.tryout.start_time,
        endTime: r.tryout.end_time,
        ageGroup: r.tryout.age_group,
        maxCapacity: r.tryout.max_capacity,
      } : null,
    }));

    return NextResponse.json(formattedRegistrations);
  } catch (error) {
    console.error("Supabase error fetching registrations:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
