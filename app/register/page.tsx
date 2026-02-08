import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import RegisterFormContainer from "./_components/RegisterFormContainer";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Register | Shadow Basketball",
  description: "Register for Shadow Basketball tryouts.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Toaster position="top-center" richColors />

      {/* Registration Form */}
      <div className="container mx-auto px-4 pt-36 pb-20 relative">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-red-600" size={48} />
              <p className="text-zinc-500 font-impact uppercase tracking-widest">Loading Registration Portal...</p>
            </div>
          }>
            <RegisterFormContainer />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
