import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import UserProfileContainer from "./_components/UserProfileContainer";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Profile | Shadow Basketball",
  description: "Manage your Shadow Basketball profile.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Toaster position="top-center" richColors />
      
      <div className="pt-24 md:pt-32">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto p-12 flex flex-col items-center justify-center space-y-4 bg-zinc-950 border border-zinc-800 rounded-3xl mt-12">
            <Loader2 className="animate-spin text-red-600" size={48} />
            <p className="text-zinc-500 font-impact uppercase tracking-widest">Loading Profile...</p>
          </div>
        }>
          <UserProfileContainer />
        </Suspense>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-950/20 to-transparent pointer-events-none z-0" />
    </main>
  );
}