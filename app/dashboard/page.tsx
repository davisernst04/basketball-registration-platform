import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "./_components/AdminDashboard";
import ParentDashboard from "./_components/ParentDashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { linkOrphanedRegistrations } from "./link-orphaned";

async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Self-healing: Ensure any guest registrations with this email are linked to this account
  await linkOrphanedRegistrations(user.email, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return <AdminDashboard />;
  }

  return <ParentDashboard />;
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
