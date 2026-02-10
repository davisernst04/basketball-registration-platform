import Navbar from "@/components/Navbar";
import { TryoutWithCount as DBTryout } from "@/types/database";
import { Tryout } from "@/types";
import { Badge } from "@/components/ui/badge";
import { createPublicClient } from "@/utils/supabase/server";
import { cacheLife } from "next/cache";
import TryoutsList from "./_components/TryoutsList";

async function getTryouts() {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();
  const { data: tryouts, error } = await supabase
    .from("tryout")
    .select(`
      *,
      registration(count)
    `)
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error fetching tryouts:", error);
    return [];
  }

  return tryouts.map((tryout: DBTryout) => ({
    ...tryout,
    startTime: tryout.start_time,
    endTime: tryout.end_time,
    ageGroup: tryout.age_group,
    maxCapacity: tryout.max_capacity,
    date: tryout.date, // already a string from Supabase
    _count: {
      registrations: tryout.registration[0]?.count || 0,
    },
  }));
}

export default async function TryoutsPage() {
  const tryouts = await getTryouts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Tryouts Header */}
      <div className="relative pt-40 pb-20 bg-black overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-6">
            <Badge className="bg-primary  text-white font-bold px-6 py-1.5 rounded-full tracking-widest text-xs">SEASON 2026</Badge>
            <h1 className="text-6xl md:text-8xl font-impact tracking-tighter uppercase leading-[0.9]">
              JOIN THE <br/><span className="text-primary">ELITE LEGACY</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              We are looking for dedicated players who are ready to push their limits. 
              Our tryout sessions are designed to identify talent, drive, and character.
            </p>
          </div>
        </div>
      </div>

      {/* Tryouts Grid */}
      <div className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>

        <div className="max-w-6xl mx-auto">
          {tryouts.length === 0 ? (
            <div className="bg-black border border-border border-dashed py-32 text-center rounded-[3rem]">
              <div className="space-y-6">
                <div className="mx-auto text-zinc-800 text-8xl">📅</div>
                <div className="space-y-2">
                  <p className="text-zinc-400 text-2xl font-impact uppercase tracking-wider">No Sessions Scheduled</p>
                  <p className="text-zinc-600">Please check back later or follow our social media for updates.</p>
                </div>
              </div>
            </div>
          ) : (
            <TryoutsList tryouts={tryouts as Tryout[]} />
          )}
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-black py-32 border-t border-zinc-900 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8 p-10 bg-black rounded-3xl border border-border">
                <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl">
                  <span className="text-primary text-2xl">🏆</span>
                </div>
                <h3 className="text-3xl font-impact tracking-wider uppercase text-white">What to prepare?</h3>
                <ul className="space-y-4">
                  {[
                    "Full basketball attire & performance shoes",
                    "Individual 32oz water bottle (minimum)",
                    "A focused, high-energy mindset",
                    "Arrive 20 minutes early for check-in"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-center group">
                      <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div> 
                      <span className="text-zinc-400 text-lg  transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-8 p-10 bg-zinc-900/30 rounded-3xl border border-border flex flex-col justify-center">
                <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl">
                  <span className="text-primary text-2xl">🕒</span>
                </div>
                <h3 className="text-3xl font-impact tracking-wider uppercase text-white">The Results</h3>
                <p className="text-zinc-500 text-xl leading-relaxed font-light italic">
                  &quot;Staff will evaluate performance metrics including footwork, shooting mechanics, defensive IQ, and coachability.&quot;
                </p>
                <div className="flex items-start gap-4 p-6 bg-black/50 rounded-2xl border border-border">
                  <div className="text-primary shrink-0 mt-1">⚠️</div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Official placement notifications will be sent via the Parent Dashboard and email within 72 hours of the final session completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}