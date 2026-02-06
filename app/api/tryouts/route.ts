import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { TryoutWithCount, Tryout } from "@/types/database";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: tryouts, error } = await supabase
      .from("tryout")
      .select(
        `
        *,
        registrations:registration(count)
      `,
      )
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase error fetching tryouts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!tryouts) return NextResponse.json([]);

    // Map to match frontend expectations (camelCase)
    const formattedTryouts = (tryouts as unknown as TryoutWithCount[]).map(
      (tryout) => ({
        id: tryout.id,
        location: tryout.location,
        date: tryout.date,
        startTime: tryout.start_time,
        endTime: tryout.end_time,
        ageGroup: tryout.age_group,
        maxCapacity: tryout.max_capacity,
        notes: tryout.notes,
        createdAt: tryout.created_at,
        updatedAt: tryout.updated_at,
        _count: {
          registrations: tryout.registrations[0]?.count || 0,
        },
      }),
    );

    return NextResponse.json(formattedTryouts);
  } catch (error) {
    console.error("Unexpected error fetching tryouts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // DEBUG: Check who is making the request
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log(
      "API POST /api/tryouts - User:",
      user?.id,
      "Email:",
      user?.email,
    );

    if (authError || !user) {
      console.error("Auth error or no user found:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { location, date, startTime, endTime, ageGroup, maxCapacity, notes } =
      body;

    if (!location || !date || !startTime || !endTime || !ageGroup) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: tryout, error } = await supabase
      .from("tryout")
      .insert({
        location,
        date: new Date(date).toISOString(),
        start_time: startTime,
        end_time: endTime,
        age_group: ageGroup,
        max_capacity: maxCapacity ? parseInt(maxCapacity.toString()) : null,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating tryout:", error);
      // Return 403 if it's a permission/RLS issue, otherwise 500
      const status = error.code === "42501" ? 403 : 500;
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status },
      );
    }

    const t = tryout as unknown as Tryout;

    // Map back to camelCase for response
    const formattedTryout = {
      id: t.id,
      location: t.location,
      date: t.date,
      startTime: t.start_time,
      endTime: t.end_time,
      ageGroup: t.age_group,
      maxCapacity: t.max_capacity,
      notes: t.notes,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };

    return NextResponse.json(formattedTryout, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating tryout:", error);
    return NextResponse.json(
      { error: "Failed to create tryout" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      id,
      location,
      date,
      startTime,
      endTime,
      ageGroup,
      maxCapacity,
      notes,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tryout ID is required" },
        { status: 400 },
      );
    }

    const { data: tryout, error } = await supabase
      .from("tryout")
      .update({
        location,
        date: new Date(date).toISOString(),
        start_time: startTime,
        end_time: endTime,
        age_group: ageGroup,
        max_capacity: maxCapacity ? parseInt(maxCapacity.toString()) : null,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating tryout:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const t = tryout as unknown as Tryout;

    // Map back to camelCase for response
    const formattedTryout = {
      id: t.id,
      location: t.location,
      date: t.date,
      startTime: t.start_time,
      endTime: t.end_time,
      ageGroup: t.age_group,
      maxCapacity: t.max_capacity,
      notes: t.notes,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    };

    return NextResponse.json(formattedTryout);
  } catch (error) {
    console.error("Unexpected error updating tryout:", error);
    return NextResponse.json(
      { error: "Failed to update tryout" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Tryout ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("tryout").delete().eq("id", id);

    if (error) {
      console.error("Supabase error deleting tryout:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting tryout:", error);
    return NextResponse.json(
      { error: "Failed to delete tryout" },
      { status: 500 },
    );
  }
}

