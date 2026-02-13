import { NextResponse } from "next/server";
import { connection } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";

export async function GET() {
  await connection();
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role using standard client (RLS usually allows reading own profile)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Try to use Admin Client to bypass RLS for fetching registrations
    // This solves issues where RLS prevents seeing unlinked guest registrations
    let queryClient = supabase;
    let isAdminClient = false;
    try {
      queryClient = await createAdminClient();
      isAdminClient = true;
    } catch (e) {
      console.warn("Admin client unavailable for fetching registrations, falling back to public client");
    }

    console.log(`[API] Fetching regs for User: ${user.id} | Email: ${user.email} | Using Admin: ${isAdminClient}`);

    let registrationsQuery = queryClient
      .from("registration")
      .select(`
        *,
        tryout (*)
      `)
      .order("created_at", { ascending: false });

    if (profile?.role !== "admin") {
      // Parents only see their own - use ilike for case-insensitive email match
      registrationsQuery = registrationsQuery.or(`user_id.eq.${user.id},parent_email.ilike.${user.email}`);
    }

    const { data: registrations, error } = await registrationsQuery;

    console.log(`[API] Query Result: ${registrations?.length || 0} rows. Error: ${error?.message}`);

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
