import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/waitlist - Get waitlist entries for a tryout (admin) or user's own entries
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const tryoutId = searchParams.get("tryout_id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let query = supabase.from("waitlist").select(`
      *,
      tryout:tryout_id (
        age_group,
        date,
        location
      )
    `);

  // Admin can see all for a tryout, regular users see only their own
  if (isAdmin && tryoutId) {
    query = query.eq("tryout_id", tryoutId);
  } else if (!isAdmin) {
    query = query.eq("user_id", user.id);
    if (tryoutId) {
      query = query.eq("tryout_id", tryoutId);
    }
  } else {
    // Admin without tryout_id - get all
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching waitlist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform to camelCase
  const transformed = data?.map((entry) => ({
    id: entry.id,
    tryoutId: entry.tryout_id,
    userId: entry.user_id,
    playerName: entry.player_name,
    playerAge: entry.player_age,
    playerGrade: entry.player_grade,
    parentName: entry.parent_name,
    parentEmail: entry.parent_email,
    parentPhone: entry.parent_phone,
    emergencyContact: entry.emergency_contact,
    emergencyPhone: entry.emergency_phone,
    medicalInfo: entry.medical_info,
    createdAt: entry.created_at,
    tryout: entry.tryout
      ? {
          ageGroup: entry.tryout.age_group,
          date: entry.tryout.date,
          location: entry.tryout.location,
        }
      : null,
  }));

  return NextResponse.json(transformed || []);
}

// DELETE /api/waitlist - Remove from waitlist (admin only)
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const waitlistId = searchParams.get("id");

  if (!waitlistId) {
    return NextResponse.json({ error: "Waitlist ID required" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { error } = await supabase.from("waitlist").delete().eq("id", waitlistId);

  if (error) {
    console.error("Error deleting waitlist entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Removed from waitlist" });
}