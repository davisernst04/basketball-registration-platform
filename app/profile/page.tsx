import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import UserProfileContainer from "./_components/UserProfileContainer";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Profile | Shadow Basketball",
  description: "Manage your athlete profile.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Toaster position="top-center" richColors />

      <div className="container mx-auto px-4 pt-36 pb-20 relative z-10">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto p-12 flex flex-col items-center justify-center space-y-4 bg-card border border-border rounded-3xl mt-12">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-zinc-500 font-impact uppercase tracking-widest">Loading Profile...</p>
          </div>
        }>
          <UserProfileContainer />
        </Suspense>
      </div>
    </div>
  );
}
