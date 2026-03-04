import { createPublicClient } from "@/utils/supabase/server";
import HomeClient from "./_components/HomeClient";
import { cacheLife } from "next/cache";

async function getFeaturedTryouts() {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();
  const { data: tryouts, error } = await supabase
    .from("tryout")
    .select(`
      *,
      registration(count)
    `)
    .order("date", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Supabase error fetching tryouts:", error);
    return [];
  }

  return tryouts.map((t: unknown) => {
    const tryout = t as any;
    return {
      ...tryout,
      startTime: tryout.start_time,
      endTime: tryout.end_time,
      ageGroup: tryout.age_group,
      maxCapacity: tryout.max_capacity,
      _count: {
        registrations: tryout.registration?.[0]?.count || 0,
      },
    };
  });
}

export default async function Home() {
  const featuredTryouts = await getFeaturedTryouts();
  return <HomeClient featuredTryouts={featuredTryouts} />;
}
