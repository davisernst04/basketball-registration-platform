import { createPublicClient } from "@/utils/supabase/server";
import RegisterForm from "./_components/RegisterForm";
import { Tryout as DBTryout } from "@/types/database";
import { Tryout, Profile } from "@/types";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getTryout(id: string): Promise<Tryout | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tryout")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const tryout = data as DBTryout;
  return {
    ...tryout,
    startTime: tryout.start_time,
    endTime: tryout.end_time,
    registrationDeadline: tryout.registration_deadline,
    ageGroup: tryout.age_group,
    maxCapacity: tryout.max_capacity,
    date: tryout.date,
  } as Tryout;
}

async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  
  return {
    ...data,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
  } as Profile;
}

async function RegisterContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const returnUrl = encodeURIComponent(`/register/${id}`);
    redirect(`/sign-in?next=${returnUrl}`);
  }

  const [tryout, profile] = await Promise.all([
    getTryout(id),
    getProfile(user.id)
  ]);

  if (!tryout) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
        <h1 className="text-white text-2xl font-impact uppercase">
          Tryout session not found
        </h1>
        <a
          href="/tryouts"
          className="text-primary mt-4 font-bold uppercase tracking-widest text-sm hover:underline"
        >
          Back to schedule
        </a>
      </div>
    );
  }

  // Construct initial user data from profile or auth user as fallback
  const userData = {
    email: profile?.email || user.email,
    fullName: profile?.fullName || user.user_metadata?.full_name,
    user_metadata: user.user_metadata
  };

  return <RegisterForm tryout={tryout} initialUser={userData} />;
}

export default function RegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="h-20 bg-black/80 w-full fixed top-0 z-50 border-b border-white/5" />
        }
      >
        <Navbar />
      </Suspense>
      <Toaster position="top-center" richColors />

      <div className="max-w-8xl mx-auto px-6 md:px-16 pt-32 pb-4 relative">
        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="bg-card border border-border rounded-3xl p-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-zinc-500 font-impact uppercase tracking-widest">
                  Loading Evaluation Portal...
                </p>
              </div>
            }
          >
            <RegisterContent params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}