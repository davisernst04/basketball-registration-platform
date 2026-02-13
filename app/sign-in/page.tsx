"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Something went wrong.");
      setLoading(false);
    } else {
      const target = next || "/dashboard";
      router.push(target);
      router.refresh();
    }
  }

  const signUpUrl = next 
    ? `/sign-up?next=${encodeURIComponent(next)}` 
    : "/sign-up";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md relative z-10"
    >
      <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 shadow-2xl overflow-hidden rounded-[2rem]">
        <CardHeader className="space-y-2 p-10 pb-2 border-b border-zinc-900/50">
          <CardTitle className="text-4xl font-impact tracking-wider text-white text-center uppercase">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-zinc-500 text-center font-medium tracking-wide">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-10 pt-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 text-sm font-medium"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    size={18}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-11 bg-zinc-900/50 border-zinc-800 text-white focus:border-primary focus:ring-primary/20 h-14 rounded-xl transition-all hover:border-zinc-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-widest ml-1"
                  >
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                    size={18}
                  />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-11 bg-zinc-900/50 border-zinc-800 text-white focus:border-primary focus:ring-primary/20 h-14 rounded-xl transition-all hover:border-zinc-700"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 p-10 pt-2 bg-zinc-950/50">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-impact text-2xl h-16 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
            </Button>
            <div className="text-sm text-center text-zinc-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href={signUpUrl}
                className="text-white hover:text-primary transition-colors font-bold ml-1"
              >
                Join the Club
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-primary/30 selection:text-white">
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <SignInContent />
        </Suspense>
      </main>
    </div>
  );
}