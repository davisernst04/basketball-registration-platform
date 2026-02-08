import { createClient, createPublicClient } from "@/utils/supabase/server";
import RegisterForm from "./RegisterForm";
import { cacheLife } from "next/cache";

async function getTryouts() {
  "use cache";
  cacheLife("minutes");
  
  const supabase = createPublicClient();
  const { data: tryouts, error } = await supabase
    .from("tryout")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Supabase error fetching tryouts:", error);
    return [];
  }

  return tryouts.map((tryout: any) => ({
    ...tryout,
    startTime: tryout.start_time,
    endTime: tryout.end_time,
    ageGroup: tryout.age_group,
    maxCapacity: tryout.max_capacity,
    date: tryout.date,
  }));
}

export default async function RegisterFormContainer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tryouts = await getTryouts();

  return <RegisterForm tryouts={tryouts as any} initialUser={user} />;
}
