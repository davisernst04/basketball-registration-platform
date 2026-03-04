import Navbar from "@/components/Navbar";
import { TryoutWithCount as DBTryout } from "@/types/database";
import { Tryout } from "@/types";
import { createPublicClient, createClient } from "@/utils/supabase/server";
import { cacheLife } from "next/cache";
import TryoutsList from "./_components/TryoutsList";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Tryouts",
  description: "View the schedule and register for upcoming Shadow Basketball club tryouts.",
};

async function getTryouts() {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();
  const { data: tryouts, error } = await supabase
    .from("tryout")
    .select(
      `
      *,
      registration(count)
    `,
    )
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error fetching tryouts:", error);
    return [];
  }

  return tryouts.map((tryout: DBTryout) => ({
    ...tryout,
    startTime: tryout.start_time,
    endTime: tryout.end_time,
    registrationDeadline: tryout.registration_deadline,
    ageGroup: tryout.age_group,
    maxCapacity: tryout.max_capacity,
    date: tryout.date,
    _count: {
      registrations: tryout.registration[0]?.count || 0,
    },
  }));
}

async function TryoutsListWrapper({ tryouts }: { tryouts: any[] }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <TryoutsList tryouts={tryouts} isAuthenticated={!!user} />;
}

export default async function TryoutsPage() {
  const tryouts = await getTryouts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Tryouts Header */}
      <div className="relative pt-32 pb-4 bg-black overflow-hidden">
        <div className="max-w-8xl mx-auto px-6 md:px-16 relative z-10">
          <div className="text-left space-y-4">
            <h1 className="text-6xl md:text-8xl font-impact tracking-tighter uppercase leading-[0.9]">
              SHADOW BASKETBALL <br />
              <span className="text-primary">TRYOUTS</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Tryouts Grid */}
      <div className="max-w-8xl mx-auto px-6 md:px-16 py-8 relative">
        <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>

        <div className="mx-auto">
          {tryouts.length === 0 ? (
            <div className="bg-black border border-border border-dashed py-32 text-center rounded-[3rem]">
              <div className="space-y-6">
                <div className="mx-auto text-zinc-800 text-8xl">📅</div>
                <div className="space-y-2">
                  <p className="text-zinc-400 text-2xl font-impact uppercase tracking-wider">
                    No Sessions Scheduled
                  </p>
                  <p className="text-zinc-600">
                    Please check back later or follow our social media for
                    updates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Suspense fallback={<TryoutsList tryouts={tryouts as any} isAuthenticated={false} />}>
              <TryoutsListWrapper tryouts={tryouts as any} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}