import { NextResponse } from "next/server";
import { createPublicClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createPublicClient();
    const { data: tryouts, error } = await supabase
      .from("tryout")
      .select(`
        *,
        registration(count)
      `)
      .order("date", { ascending: true });

    if (error) throw error;

    const formattedTryouts = tryouts.map((t: any) => ({
      ...t,
      startTime: t.start_time,
      endTime: t.end_time,
      ageGroup: t.age_group,
      maxCapacity: t.max_capacity,
      _count: {
        registrations: t.registration[0]?.count || 0,
      },
    }));

    return NextResponse.json(formattedTryouts);
  } catch (error) {
    console.error("Supabase error fetching tryouts:", error);
    return NextResponse.json({ error: "Failed to fetch tryouts" }, { status: 500 });
  }
}
